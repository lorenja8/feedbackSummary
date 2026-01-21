from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.deps import get_db
from api.schemas.course_teacher import CourseTeacherCreate, CourseTeacherRead
from api.crud.course_teacher import (
    add_teacher_to_course,
    remove_teacher_from_course,
    list_teachers_in_course,
    list_courses_of_teacher,
    list_pairs_course_teacher)
from api.crud.user import get_user
from api.crud.course import get_course
from api.auth.auth_handler import require_role


router = APIRouter(prefix="/courses-teachers",
                   tags=["courses-teachers"],
                   dependencies=[Depends(require_role("admin"))])


@router.post("/", response_model=CourseTeacherRead)
def add_pair_course_teacher(data: CourseTeacherCreate, db: Session = Depends(get_db)):
    existing_teacher = get_user(db, data.teacher_id)
    if not existing_teacher:
        raise HTTPException(
            status_code=404,
            detail="teacher_id not found"
        )
    existing_course = get_course(db, data.course_id)
    if not existing_course:
        raise HTTPException(
            status_code=404,
            detail="course_id not found"
        )
    return add_teacher_to_course(db, data)


@router.get("/by-course/{course_id}", response_model=list[CourseTeacherRead])
def list_teachers_enrolled_in_course(course_id: int, db: Session = Depends(get_db)):
    return list_teachers_in_course(db, course_id)


@router.get("/by-teacher/{teacher_id}", response_model=list[CourseTeacherRead])
def list_courses_attended_by_teacher(teacher_id: int, db: Session = Depends(get_db)):
    return list_courses_of_teacher(db, teacher_id)


@router.get("/", response_model=list[CourseTeacherRead])
def list_all_pairs_course_teacher(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return list_pairs_course_teacher(db, skip, limit)


@router.delete("/course/{course_id}/teacher/{teacher_id}")
def delete_record(course_id: int, teacher_id: int, db: Session = Depends(get_db)):
    ok = remove_teacher_from_course(db, course_id, teacher_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Record not found")
    return {"status": "removed"}
