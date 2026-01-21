from pydantic import BaseModel, ConfigDict


class CourseStudentBase(BaseModel):
    course_id: int
    student_id: int


class CourseStudentCreate(CourseStudentBase):
    pass


class CourseStudentRead(CourseStudentBase):
    model_config = ConfigDict(from_attributes=True)
