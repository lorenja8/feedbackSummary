from sqlalchemy.orm import Session
from db.tables import User, Course, CourseStudent, CourseTeacher


def crud_get_teachers_for_student(db: Session, user_id: int):
    query = (
        db
        .query(CourseStudent.course_id,
               Course.course_name,
               CourseTeacher.teacher_id,
               User.name.label("teacher_name"))
        .join(CourseTeacher, CourseStudent.course_id == CourseTeacher.course_id)
        .join(User, User.id == CourseTeacher.teacher_id)
        .join(Course, Course.course_id == CourseStudent.course_id)
        .filter(CourseStudent.student_id == user_id)
    )
    return query.all()


def crud_get_courses_for_teacher(db: Session, teacher_id: int):
    query = (db.query(CourseTeacher.course_id,
                      Course.course_name)
             .join(CourseTeacher, Course.course_id == CourseTeacher.course_id)
             .filter(CourseTeacher.teacher_id == teacher_id))
    return query.all()

