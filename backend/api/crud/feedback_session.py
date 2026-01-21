from sqlalchemy.orm import Session
from db.tables import FeedbackSession
from api.schemas.feedback_session import (
    FeedbackSessionCreate,
    FeedbackSessionUpdate)


def create_feedback_session(db: Session, data: FeedbackSessionCreate):
    session = FeedbackSession(**data.dict())
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def get_feedback_session(db: Session, session_id: int):
    return db.get(FeedbackSession, session_id)


def list_feedback_sessions(db: Session):
    return db.query(FeedbackSession).all()


def delete_feedback_session(db: Session, session_id: int):
    obj = db.get(FeedbackSession, session_id)
    if obj:
        db.delete(obj)
        db.commit()
        return True
    return False


def get_questions_for_session(db: Session, session_id: int):
    result = (
        db.query(FeedbackSession.questions_json)
        .filter(FeedbackSession.session_id == session_id)
        .scalar())
    return result or {}


def update_feedback_session(db: Session, session_id: int, updated_session: FeedbackSessionUpdate):
    obj = get_feedback_session(db, session_id)
    if not obj:
        return None
    if "session_name" in updated_session.model_fields_set:
        obj.session_name = updated_session.session_name
    if "questions_json" in updated_session.model_fields_set:
        obj.questions_json = updated_session.questions_json
    if "starts_at" in updated_session.model_fields_set:
        obj.starts_at = updated_session.starts_at
    if "closes_at" in updated_session.model_fields_set:
        obj.closes_at = updated_session.closes_at
    db.commit()
    db.refresh(obj)
    return obj
