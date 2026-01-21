from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict, RootModel
from datetime import datetime


class FeedbackSessionBase(BaseModel):
    session_name: str
    questions_json: dict | list | None = None
    starts_at: datetime
    closes_at: datetime | None = None


class FeedbackSessionCreate(FeedbackSessionBase):
    pass


class FeedbackSessionRead(FeedbackSessionBase):
    session_id: int

    model_config = ConfigDict(from_attributes=True)


class FeedbackSessionQuestionsRead(RootModel[Dict[str, Any]]):
    pass


class FeedbackSessionUpdate(BaseModel):
    session_name: Optional[str] = None
    questions_json: Optional[dict] | Optional[list] | Optional[None] = None
    starts_at: Optional[datetime] = None
    closes_at: Optional[datetime] = None
