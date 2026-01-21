from typing import Optional
from pydantic import BaseModel, ConfigDict


class CourseBase(BaseModel):
    course_name: str


class CourseCreate(CourseBase):
    pass


class CourseRead(CourseBase):
    course_id: int

    model_config = ConfigDict(from_attributes=True)


class CourseUpdate(BaseModel):
    course_name: Optional[str] = None
