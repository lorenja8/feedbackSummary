from sqlalchemy.orm import Session
from db.tables import Course
from api.schemas.course import CourseCreate,  CourseUpdate


def create_course(db: Session, course: CourseCreate) -> Course:
    obj = Course(course_name=course.course_name)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def get_course(db: Session, course_id: int) -> Course | None:
    return db.query(Course).filter(Course.course_id == course_id).first()


def get_courses(db: Session):
    return db.query(Course).all()


def delete_course(db: Session, course_id: int) -> bool:
    obj = get_course(db, course_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True


def update_course(db: Session, course_id: int, updated_course: CourseUpdate):
    obj = get_course(db, course_id)
    if not obj:
        return None
    if updated_course.course_name is not None:
        obj.course_name = updated_course.course_name
    db.commit()
    db.refresh(obj)
    return obj
