from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.schemas.feedback_entry import (
    FeedbackEntryCreate,
    FeedbackEntryRead,
    FeedbackEntryUpdate,
    FeedbackEntryFilter,
    FeedbackEntrySummary)
from api.crud.feedback_entry import (
    get_feedback_entry,
    has_feedback_for_session,
    delete_feedback_entry,
    update_feedback_entry,
    crud_get_feedback_for_filter,
    crud_get_feedback_for_filter_summarized,
    upsert_feedback)
from api.deps import get_db
from api.crud.user import get_user
from api.crud.feedback_session import get_feedback_session
from api.crud.course import get_course
from api.auth.auth_handler import require_role

router = APIRouter(prefix="/feedback-entries",
                   tags=["feedback-entries"],
                   dependencies=[Depends(require_role("admin", "teacher", "student"))])


@router.post("/", response_model=FeedbackEntryRead)
def upsert_entry(data: FeedbackEntryCreate, db: Session = Depends(get_db)):
    existing_teacher = get_user(db, data.reviewed_teacher_id)
    if not existing_teacher:
        raise HTTPException(
            status_code=404,
            detail="teacher_id does not exist"
        )
    existing_student = get_user(db, data.reviewing_student_id)
    if not existing_student:
        raise HTTPException(
            status_code=404,
            detail="student_id does not exist"
        )
    existing_session = get_feedback_session(db, data.session_id)
    if not existing_session:
        raise HTTPException(
            status_code=404,
            detail="session_id does not exist"
        )
    existing_course = get_course(db, data.reviewed_course_id)
    if not existing_course:
        raise HTTPException(
            status_code=404,
            detail="course_id does not exist"
        )
    return upsert_feedback(db, data)


@router.get("/{feedback_id}", response_model=FeedbackEntryRead)
def read_entry(feedback_id: int, db: Session = Depends(get_db)):
    entry = get_feedback_entry(db, feedback_id)
    if not entry:
        raise HTTPException(404, "Feedback entry not found")
    return entry


@router.get("/", response_model=list[FeedbackEntryRead])
def read_all(db: Session = Depends(get_db)):
    return crud_get_feedback_for_filter(db)


@router.get("/session/{session_id}/has-feedback", response_model=bool)
def read_for_session_has_feedback(session_id: int, db: Session = Depends(get_db)):
    return has_feedback_for_session(db, session_id)


@router.post("/filter", response_model=list[FeedbackEntryRead])
def get_feedback_for_filter(custom_filter: FeedbackEntryFilter, db: Session = Depends(get_db)):
    return crud_get_feedback_for_filter(db, custom_filter)


@router.post("/summary", response_model=dict)
def get_feedback_for_filter_summarized(custom_filter: FeedbackEntrySummary, db: Session = Depends(get_db)):
    return crud_get_feedback_for_filter_summarized(db, custom_filter)


@router.delete("/{feedback_id}")
def delete_entry(feedback_id: int, db: Session = Depends(get_db)):
    success = delete_feedback_entry(db, feedback_id)
    if not success:
        raise HTTPException(404, "Feedback entry not found")
    return {"deleted": True}


@router.put("/{feedback_id}", response_model=FeedbackEntryRead)
def update_entry_endpoint(feedback_id: int, feedback_entry: FeedbackEntryUpdate, db: Session = Depends(get_db)):
    existing = get_feedback_entry(db, feedback_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Feedback entry not found.")
    return update_feedback_entry(db, feedback_id, feedback_entry)
