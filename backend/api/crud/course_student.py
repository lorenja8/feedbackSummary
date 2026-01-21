from sqlalchemy.orm import Session
from db.tables import CourseStudent
from api.schemas.course_student import CourseStudentCreate


def add_student_to_course(db: Session, data: CourseStudentCreate):
    existing = db.query(CourseStudent).filter(
        CourseStudent.course_id == data.course_id,
        CourseStudent.student_id == data.student_id
    ).first()

    if existing:
        return existing

    obj = CourseStudent(
        course_id=data.course_id,
        student_id=data.student_id
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def remove_student_from_course(db: Session, course_id: int, student_id: int) -> bool:
    obj = db.query(CourseStudent).filter(
        CourseStudent.course_id == course_id,
        CourseStudent.student_id == student_id
    ).first()

    if not obj:
        return False

    db.delete(obj)
    db.commit()
    return True


def list_students_in_course(db: Session, course_id: int):
    return db.query(CourseStudent).filter(
        CourseStudent.course_id == course_id
    ).all()


def list_courses_of_student(db: Session, student_id: int):
    return db.query(CourseStudent).filter(
        CourseStudent.student_id == student_id
    ).all()


def list_pairs_course_student(db: Session, skip=0, limit=50):
    return db.query(CourseStudent).offset(skip).limit(limit).all()
