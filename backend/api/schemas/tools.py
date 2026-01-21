from pydantic import BaseModel


class StudentTeachersRead(BaseModel):
    teacher_id: int
    teacher_name: str
    course_id: int
    course_name: str


class TeacherCourseRead(BaseModel):
    course_id: int
    course_name: str

