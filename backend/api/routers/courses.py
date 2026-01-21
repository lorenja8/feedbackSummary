from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.deps import get_db
from api.schemas.course import CourseCreate, CourseRead, CourseUpdate
from api.crud.course import (
    create_course,
    get_course,
    get_courses,
    delete_course,
    update_course)
from api.auth.auth_handler import require_role

router = APIRouter(prefix="/courses",
                   tags=["courses"],
                   dependencies=[Depends(require_role("admin", "teacher", "student"))])


@router.post("/", response_model=CourseRead)
def create(course: CourseCreate, db: Session = Depends(get_db)):
    return create_course(db, course)


@router.get("/{course_id}", response_model=CourseRead)
def read(course_id: int, db: Session = Depends(get_db)):
    obj = get_course(db, course_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Course not found")
    return obj


@router.get("/", response_model=list[CourseRead])
def read_all(db: Session = Depends(get_db)):
    return get_courses(db)


@router.delete("/{course_id}")
def delete(course_id: int, db: Session = Depends(get_db)):
    ok = delete_course(db, course_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Course not found.")
    return {"status": "deleted"}


@router.put("/{course_id}", response_model=CourseRead)
def update_user_endpoint(course_id: int, course: CourseUpdate, db: Session = Depends(get_db)):
    existing = get_course(db, course_id)
    if not existing:
        raise HTTPException(status_code=404, detail="User not found.")
    return update_course(db, course_id, course)
