import os
from typing import List, Union

import onnxruntime
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, Response

from utils.video import process_video
from utils.options import get_options
from utils.image import process_image
from utils.schema import BoundingBox


load_dotenv('.env')
os.makedirs('files', exist_ok=True)
options = get_options('configs/config.yml')
ort_session = onnxruntime.InferenceSession('models/yolov5s.simp.onnx')

app = FastAPI(debug=True)
app.add_middleware(
    CORSMiddleware, allow_origins=['*'], allow_credentials=True, allow_methods=['*'], allow_headers=['*']
)
app.mount('/files', StaticFiles(directory='files'), name='files')


@app.post('/predict/image', response_class=Response)
async def predict(file: UploadFile = File(...)) -> Response:
    """
    Run prediction and drawing procedures for single image.

    Parameters:
        file: Image file.
    """
    return await process_image(file, ort_session, options, return_boxes=False)


@app.post('/predict/boxes', response_model=List[BoundingBox])
async def predict_boxes(file: UploadFile = File(...)) -> Union[BoundingBox, Response]:
    """
    Run prediction procedure on single image.

    Parameters:
        file: Image file.
    """
    return await process_image(file, ort_session, options, return_boxes=True)


@app.post('/predict/video', response_class=Response)
async def predict_video(file: UploadFile = File(...)) -> Response:
    result = process_video(file, ort_session, options)
    if not isinstance(result, str):
        return result
    path_to_precessed_video = os.path.join(os.getenv('VIDEO_API_BASE_PATH') + os.getenv('PORT'), result)
    return Response(content=path_to_precessed_video, media_type='text')
