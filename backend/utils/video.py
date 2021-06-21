import os
import time
import shutil
from typing import Union

import ffmpeg
import numpy as np
from onnxruntime import InferenceSession
from fastapi import status, File, HTTPException

from .image import detect
from .drawing import draw_one_box
from .schema import VideoMetadata, ServiceOptions


TEN_MEGABYTES = 1e+7


def get_video_metadata(video_path: str) -> Union[VideoMetadata, None]:
    """
    Extract metadata from video file.

    :param video_path: Path to video file.

    :return: Video metadata as object or None if video is broken.
    """
    metadata = ffmpeg.probe(video_path)
    stream_metadata = None
    for stream in metadata['streams']:
        stream_attrs = stream.keys()
        if (
                'width' in stream_attrs
                and 'height' in stream_attrs
                and 'r_frame_rate' in stream_attrs
                and 'pix_fmt' in stream_attrs
        ):
            stream_metadata = stream
    if stream_metadata is None:
        return None
    format_metadata = metadata['format']
    fps = int(stream_metadata['r_frame_rate'].split('/')[0])
    duration = format_metadata.get('duration')
    if duration is None:
        return None
    else:
        duration = float(duration)
    return VideoMetadata(
        name=os.path.split(format_metadata['filename'])[-1].split('.')[0],
        width=stream_metadata['width'],
        height=stream_metadata['height'],
        pixel_format=stream_metadata['pix_fmt'],
        number_of_frames=int(duration * fps)
    )


def process_video(video_file: File, session: InferenceSession, options: ServiceOptions) -> str:
    """
    Perform full detection procedure on video by processing each frame with following actions:
        1) Preprocess image;
        2) Perform detection;
        3) Draw boxes on the image.

    :param video_file: Video file;
    :param session: ONNX runtime inference session to perform detections;
    :param options: Option object with service settings.

    :return: Path to processed video.

    :raises HTTPException with 500 code in case of broken video; HTTPException with 501 code in case of video is too
        large or hasn't allowed extension.
    """
    _, ext = os.path.splitext(video_file.filename)
    if ext[1:] not in options.available_video_extensions:
        message = (
            f'Your file has {ext[1:]} extension that is not allowed. '
            f'Please, use only {options.available_video_extensions} files.'
        )
        raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=message)
    filename = '_'.join(('video', str(time.time()))) + ext
    source_file_path = os.path.join('files', filename)
    with open(source_file_path, 'wb') as video_buffer:
        shutil.copyfileobj(video_file.file, video_buffer)
    base_path, file_name = os.path.split(source_file_path)
    name, ext = os.path.splitext(file_name)
    save_path = os.path.join(base_path, '_'.join((name, 'processed')) + ext)
    if os.path.getsize(source_file_path) > TEN_MEGABYTES:
        message = 'Your video file is too large.'
        raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=message)
    video_metadata = get_video_metadata(source_file_path)
    if video_metadata is None:
        message = 'Your video is broken.'
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=message)
    read_process = (
        ffmpeg
        .input(source_file_path)
        .output('pipe:', format='rawvideo', pix_fmt='rgb24', vframes=video_metadata.number_of_frames)
        .run_async(pipe_stdout=True)
    )
    write_process = (
        ffmpeg
        .input('pipe:', format='rawvideo', pix_fmt='rgb24', s=f'{video_metadata.width}x{video_metadata.height}')
        .output(save_path, pix_fmt=video_metadata.pixel_format)
        .overwrite_output()
        .run_async(pipe_stdin=True)
    )
    while True:
        in_bytes = read_process.stdout.read(video_metadata.height * video_metadata.width * 3)
        if not in_bytes:
            break
        in_frame = np.frombuffer(in_bytes, np.uint8).reshape((video_metadata.height, video_metadata.width, 3))

        boxes = detect(in_frame, session, options)
        for box in boxes:
            draw_one_box(in_frame, box)

        write_process.stdin.write(in_frame.astype(np.uint8).tobytes())
    write_process.stdin.close()
    read_process.wait()
    write_process.wait()
    return save_path
