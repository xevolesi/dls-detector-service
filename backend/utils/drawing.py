import cv2
import numpy as np

from .schema import BoundingBox


def draw_one_box(image: np.ndarray, box: BoundingBox) -> None:
    """
    Draw one bounding box for single object with caption contained class name and confidence. Mutates input image.

    Parameters:
        image: Image to draw;
        box: Bounding box.

    Returns:
        None.
    """
    image_height, image_width, _ = image.shape
    scaled_left_x, scaled_left_y, scaled_width, scaled_height = box.coordinates
    top_left_x = int(scaled_left_x * image_width)
    top_left_y = int(scaled_left_y * image_height)
    bottom_right_x = int(scaled_width * image_width + top_left_x)
    bottom_right_y = int(scaled_height * image_height + top_left_y)

    # Draw object box.
    cv2.rectangle(image, (top_left_x, top_left_y), (bottom_right_x, bottom_right_y), box.color, thickness=5)

    caption = f'{box.class_name}: {box.confidence:.2f}'
    (width, height), baseline = cv2.getTextSize(caption, 0, fontScale=1.7, thickness=2)

    # Draw caption box and fill it with box color.
    cv2.rectangle(image, (top_left_x, top_left_y), (top_left_x + width, top_left_y - height - 10), box.color, -1)

    # Draw caption.
    cv2.putText(image, caption, (top_left_x, top_left_y - 5), 0, 1.7, [0, 0, 0], thickness=2, lineType=cv2.LINE_AA)
