from sqlalchemy.orm import Session
from sqlalchemy import exists
from db.tables import FeedbackEntry
from api.schemas.feedback_entry import (
    FeedbackEntryCreate,
    FeedbackEntryUpdate,
    FeedbackEntryFilter,
    FeedbackEntrySummary)
from analyzer.analyze import analyze_feedback_safe


def create_feedback_entry(db: Session, data: FeedbackEntryCreate):
    existing = db.query(FeedbackEntry).filter(
        FeedbackEntry.reviewed_teacher_id == data.reviewed_teacher_id,
        FeedbackEntry.reviewing_student_id == data.reviewing_student_id,
        FeedbackEntry.reviewed_course_id == data.reviewed_course_id,
        FeedbackEntry.session_id == data.session_id,
    ).first()

    if existing:
        return existing

    entry = FeedbackEntry(**data.dict())

    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def get_feedback_entry(db: Session, feedback_id: int):
    return db.get(FeedbackEntry, feedback_id)


def has_feedback_for_session(db: Session, session_id: int):
    return (db
            .query(exists().where(FeedbackEntry.session_id == session_id))
            .scalar())


def crud_get_feedback_for_filter(db: Session, custom_filter: FeedbackEntryFilter = None):
    query = db.query(FeedbackEntry)

    if custom_filter is None:
        return query.all()

    if custom_filter.course_ids:
        query = query.filter(
            FeedbackEntry.reviewed_course_id.in_(custom_filter.course_ids)
        )

    if custom_filter.session_id is not None:
        query = query.filter(
            FeedbackEntry.session_id == custom_filter.session_id
        )

    if custom_filter.reviewed_teacher_id is not None:
        query = query.filter(
            FeedbackEntry.reviewed_teacher_id == custom_filter.reviewed_teacher_id
        )

    if custom_filter.reviewing_student_id is not None:
        query = query.filter(
            FeedbackEntry.reviewing_student_id == custom_filter.reviewing_student_id
        )

    return query.all()


def crud_get_feedback_for_filter_summarized(db: Session, custom_filter: FeedbackEntrySummary):
    query = (
        db.query(FeedbackEntry)
        .filter(FeedbackEntry.reviewed_course_id.in_(custom_filter.course_ids),
                FeedbackEntry.reviewed_teacher_id == custom_filter.reviewed_teacher_id,
                FeedbackEntry.session_id == custom_filter.session_id)
        .all())

    if not query:
        return None

    texts = [entry.feedback_json[custom_filter.question_id] for entry in query]

    summary = analyze_feedback_safe(texts)

    return summary


def delete_feedback_entry(db: Session, feedback_id: int):
    entry = db.get(FeedbackEntry, feedback_id)
    if entry:
        db.delete(entry)
        db.commit()
        return True
    return False


def update_feedback_entry(db: Session, feedback_id: int, updated_feedback: FeedbackEntryUpdate):
    obj = get_feedback_entry(db, feedback_id)
    if not obj:
        return None
    if "feedback_json" in updated_feedback.model_fields_set:
        obj.feedback_json = updated_feedback.feedback_json
    db.commit()
    db.refresh(obj)
    return obj


def upsert_feedback(db: Session, data: FeedbackEntryCreate):
    existing = db.query(FeedbackEntry).filter_by(
        session_id=data.session_id,
        reviewed_teacher_id=data.reviewed_teacher_id,
        reviewing_student_id=data.reviewing_student_id,
        reviewed_course_id=data.reviewed_course_id
    ).one_or_none()

    if existing:
        existing.feedback_json = data.feedback_json
        db.add(existing)
        db.commit()
        db.refresh(existing)
        return existing
    else:
        new = FeedbackEntry(**data.dict())
        db.add(new)
        db.commit()
        db.refresh(new)
        return new
