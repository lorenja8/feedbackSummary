from pydantic import BaseModel, Field
from typing import List


class Trait(BaseModel):
    trait: str
    examples: List[str] = Field(default_factory=list)


class FeedbackSummary(BaseModel):
    overall_sentiment: str
    traits: List[Trait] = Field(default_factory=list)
