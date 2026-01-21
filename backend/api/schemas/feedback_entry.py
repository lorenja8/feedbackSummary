from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime


class FeedbackEntryBase(BaseModel):
    reviewed_teacher_id: int
    reviewing_student_id: int
    reviewed_course_id: int
    session_id: int
    feedback_json: dict | list | None = None


class FeedbackEntryCreate(FeedbackEntryBase):
    pass


class FeedbackEntryRead(FeedbackEntryBase):
    feedback_id: int
    feedback_json: dict | list | None = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class FeedbackEntryFilter(BaseModel):
    course_ids: Optional[list[int]] = None
    session_id: Optional[int] = None
    reviewed_teacher_id: Optional[int] = None
    reviewing_student_id: Optional[int] = None


class FeedbackEntrySummary(FeedbackEntryFilter):
    question_id: str


class FeedbackEntryUpdate(BaseModel):
    feedback_json: Optional[dict] | Optional[list] | Optional[None] = None
