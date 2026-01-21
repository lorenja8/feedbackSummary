from pydantic import BaseModel, ConfigDict


class CourseTeacherBase(BaseModel):
    course_id: int
    teacher_id: int


class CourseTeacherCreate(CourseTeacherBase):
    pass


class CourseTeacherRead(CourseTeacherBase):
    model_config = ConfigDict(from_attributes=True)
