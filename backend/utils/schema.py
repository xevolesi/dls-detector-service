from typing import List, Dict

from pydantic import BaseModel


class VideoMetadata(BaseModel):
    """Holds necessary information about video file."""
    name: str
    width: int
    height: int
    pixel_format: str
    number_of_frames: int


class BoundingBox(BaseModel):
    """Represents single bounding-box."""
    color: List[int]
    class_name: str
    confidence: float
    coordinates: List[float]


class ServiceOptions(BaseModel):
    """Holds service config."""
    available_image_extensions: List[str]
    available_video_extensions: List[str]
    class_names: List[str]
    class_colors: Dict[str, List[int]]
