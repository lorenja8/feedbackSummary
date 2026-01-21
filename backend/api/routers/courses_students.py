from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.deps import get_db
from api.schemas.course_student import CourseStudentCreate, CourseStudentRead
from api.crud.course_student import (
    add_student_to_course,
    remove_student_from_course,
    list_students_in_course,
    list_courses_of_student,
    list_pairs_course_student)
from api.crud.user import get_user
from api.crud.course import get_course
from api.auth.auth_handler import require_role

router = APIRouter(prefix="/courses-students",
                   tags=["courses-students"],
                   dependencies=[Depends(require_role("admin"))])


@router.post("/", response_model=CourseStudentRead)
def add_pair_course_student(data: CourseStudentCreate, db: Session = Depends(get_db)):
    existing_student = get_user(db, data.student_id)
    if not existing_student:
        raise HTTPException(
            status_code=404,
            detail="student_id does not exist"
        )
    existing_course = get_course(db, data.course_id)
    if not existing_course:
        raise HTTPException(
            status_code=404,
            detail="course_id does not exist"
        )
    return add_student_to_course(db, data)


@router.get("/by-course/{course_id}", response_model=list[CourseStudentRead])
def list_students_enrolled_in_course(course_id: int, db: Session = Depends(get_db)):
    return list_students_in_course(db, course_id)


@router.get("/by-student/{student_id}", response_model=list[CourseStudentRead])
def list_courses_attended_by_student(student_id: int, db: Session = Depends(get_db)):
    return list_courses_of_student(db, student_id)


@router.get("/", response_model=list[CourseStudentRead])
def list_all_pairs_course_student(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return list_pairs_course_student(db, skip, limit)


@router.delete("/course/{course_id}/student/{student_id}")
def delete_record(course_id: int, student_id: int, db: Session = Depends(get_db)):
    ok = remove_student_from_course(db, course_id, student_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Relationship not found")
    return {"status": "removed"}
