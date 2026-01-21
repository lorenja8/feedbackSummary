from sqlalchemy.orm import Session
from db.tables import CourseTeacher
from api.schemas.course_teacher import CourseTeacherCreate


def add_teacher_to_course(db: Session, data: CourseTeacherCreate):
    # Check if already exists
    existing = db.query(CourseTeacher).filter(
        CourseTeacher.course_id == data.course_id,
        CourseTeacher.teacher_id == data.teacher_id
    ).first()

    if existing:
        return existing

    obj = CourseTeacher(
        course_id=data.course_id,
        teacher_id=data.teacher_id
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def remove_teacher_from_course(db: Session, course_id: int, teacher_id: int) -> bool:
    obj = db.query(CourseTeacher).filter(
        CourseTeacher.course_id == course_id,
        CourseTeacher.teacher_id == teacher_id
    ).first()

    if not obj:
        return False

    db.delete(obj)
    db.commit()
    return True


def list_teachers_in_course(db: Session, course_id: int):
    return db.query(CourseTeacher).filter(
        CourseTeacher.course_id == course_id
    ).all()


def list_courses_of_teacher(db: Session, teacher_id: int):
    return db.query(CourseTeacher).filter(
        CourseTeacher.teacher_id == teacher_id
    ).all()


def list_pairs_course_teacher(db: Session, skip=0, limit=50):
    return db.query(CourseTeacher).offset(skip).limit(limit).all()
