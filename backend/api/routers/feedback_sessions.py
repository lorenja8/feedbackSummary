from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.deps import get_db
from api.crud.feedback_session import (
    create_feedback_session,
    get_feedback_session,
    list_feedback_sessions,
    delete_feedback_session,
    update_feedback_session,
    get_questions_for_session)
from api.schemas.feedback_session import (
    FeedbackSessionCreate,
    FeedbackSessionRead,
    FeedbackSessionUpdate,
    FeedbackSessionQuestionsRead)
from api.auth.auth_handler import require_role

router = APIRouter(prefix="/feedback-sessions",
                   tags=["feedback-sessions"],
                   dependencies=[Depends(require_role("admin", "teacher", "student"))])


@router.post("/", response_model=FeedbackSessionRead)
def create_session(data: FeedbackSessionCreate, db: Session = Depends(get_db)):
    return create_feedback_session(db, data)


@router.get("/", response_model=list[FeedbackSessionRead])
def get_all_sessions(db: Session = Depends(get_db)):
    return list_feedback_sessions(db)


@router.get("/{session_id}", response_model=FeedbackSessionRead)
def get_session(session_id: int, db: Session = Depends(get_db)):
    session = get_feedback_session(db, session_id)
    if not session:
        raise HTTPException(404, "Feedback session not found")
    return session


@router.get("/{session_id}/questions", response_model=FeedbackSessionQuestionsRead)
def get_session_questions(session_id: int, db: Session = Depends(get_db)):
    session_questions = get_questions_for_session(db, session_id)
    if not session_questions:
        raise HTTPException(404, "Feedback session not found")
    return session_questions


@router.delete("/{session_id}")
def delete_session(session_id: int, db: Session = Depends(get_db)):
    ok = delete_feedback_session(db, session_id)
    if not ok:
        raise HTTPException(404, "Feedback session not found")
    return {"status": "deleted"}


@router.put("/{session_id}", response_model=FeedbackSessionRead)
def update_session(session_id: int, feedback_session: FeedbackSessionUpdate, db: Session = Depends(get_db)):
    existing = get_feedback_session(db, session_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Feedback session not found.")
    return update_feedback_session(db, session_id, feedback_session)
