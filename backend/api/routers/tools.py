from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.deps import get_db
from api.schemas.tools import (
    StudentTeachersRead,
    TeacherCourseRead)
from api.crud.user import get_user
from api.crud.tools import (
    crud_get_teachers_for_student,
    crud_get_courses_for_teacher)
from api.auth.auth_handler import require_role

router = APIRouter(prefix="/tools",
                   tags=["tools"],
                   dependencies=[Depends(require_role("admin", "teacher", "student"))])


@router.get("/teachers-for-student/{user_id}", response_model=list[StudentTeachersRead])
def get_teachers_for_student(user_id: int, db: Session = Depends(get_db)):
    existing = get_user(db, user_id)
    if not existing:
        raise HTTPException(status_code=404, detail="User not found.")
    return crud_get_teachers_for_student(db, user_id)


@router.get("/courses-for-teacher/{teacher_id}", response_model=list[TeacherCourseRead])
def get_courses_for_teacher(teacher_id: int, db: Session = Depends(get_db)):
    existing = get_user(db, teacher_id)
    if not existing:
        raise HTTPException(status_code=404, detail="User not found.")
    return crud_get_courses_for_teacher(db, teacher_id)
