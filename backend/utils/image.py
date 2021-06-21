import sys
from typing import Union, List

import cv2
import numpy as np
from onnxruntime import InferenceSession
from fastapi import status, Response, HTTPException, File

from .drawing import draw_one_box
from .schema import BoundingBox, ServiceOptions


TEN_MEGABYTES = 1e+7


def preprocess_image(image: np.ndarray) -> List[np.ndarray]:
    """
    Preprocess image for onnxruntime inference session.

    :param image: Image for preprocessing.

    :return: List with single image.
    """
    tensor = image[:, :, ::-1].astype(np.float32)
    tensor = np.transpose(tensor, (2, 0, 1))
    tensor /= 255.
    tensor = [tensor]
    return tensor


def detect(image: np.ndarray, session: InferenceSession, options: ServiceOptions) -> List[BoundingBox]:
    """
    Perform detection on single image.

    :param image: Image for detection;
    :param session: ONNX runtime inference session to perform detections;
    :param options: Option object with service settings.

    :return: List with bounding-boxes.
    """
    image_height, image_width, _ = image.shape
    tensor_list = preprocess_image(image.copy())
    ort_inputs = dict((session.get_inputs()[i].name, tensor) for i, tensor in enumerate(tensor_list))
    confidences, class_indices, boxes = session.run(None, ort_inputs)
    class_names = list(map(lambda class_index: options.class_names[int(class_index)], class_indices.tolist()))
    boxes = boxes.tolist()
    bounding_boxes = []
    for confidence, class_name, box in zip(confidences, class_names, boxes):
        xs = np.clip(box[::2], 1, image.shape[1]).astype(int)
        ys = np.clip(box[1::2], 1, image.shape[0]).astype(int)
        bounding_boxes.append(
            BoundingBox(
                color=options.class_colors[class_name],
                class_name=class_name,
                confidence=confidence,
                coordinates=[
                    xs[0] / image_width,
                    ys[0] / image_height,
                    (xs[1] - xs[0]) / image_width,
                    (ys[1] - ys[0]) / image_height
                ]
            )
        )
    return bounding_boxes


async def process_image(
        file: File,
        session: InferenceSession,
        options: ServiceOptions,
        return_boxes: bool = False
) -> Union[Response, List[BoundingBox]]:
    """
    Perform full detection procedure:
        1) Preprocess image;
        2) Perform detection;
        3) Optionally draw boxes on the image.

    :param file: Image file;
    :param session: ONNX runtime inference session to perform detections;
    :param options: Option object with service settings;
    :param return_boxes: Whether to return only boxes or not.

    :return: If return_boxes is True then return list with bounding-boxes. Otherwise return Response object with image
        with drawn bounding-boxes.

    :raise HTTPException with 500 code in case of broken image or if the file is not an image; HTTPException with
        501 code in case of image is too large or hasn't allowed extension or has 2 or more than 5 channels.
    """
    image_extension = file.filename.split('.')[-1]
    if image_extension not in options.available_image_extensions:
        message = (
            f'Your file has {image_extension} extension that is not allowed. '
            f'Please, use only {options.available_image_extensions} files.'
        )
        raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=message)
    try:
        image_bytes = await file.read()
        if sys.getsizeof(image_bytes) > TEN_MEGABYTES:
            message = 'Your image file is too big.'
            raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=message)
        image = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), -1)
    except cv2.error:
        message = 'Your image file is corrupted or you are trying to use not an image file.'
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=message)
    if image is None:
        message = 'Your image is broken.'
        raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=message)
    image_height, image_width, image_channels = image.shape
    if image_channels == 1:
        image = np.dstack((image, image, image))
    elif image_channels == 4:
        image = cv2.cvtColor(image, cv2.COLOR_BGRA2BGR)
    elif image_channels == 2 or image_channels > 5:
        message = (
            'It seems like your image has 2 or more than 5 channels. Please use images with 1, 3 or 4 channels instead.'
        )
        raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=message)

    # Do detection.
    boxes = detect(image, session, options)

    if return_boxes:
        boxes = sorted(boxes, key=lambda x: x.coordinates[-2] * x.coordinates[-1], reverse=True)
        return boxes

    # Draw boxes.
    for box in boxes:
        draw_one_box(image, box)

    # Convert image with boxes to bytes.
    image_bytes = cv2.imencode(f'.{image_extension}', image)[1].tobytes()
    return Response(content=image_bytes, media_type=f'image/{image_extension}')
