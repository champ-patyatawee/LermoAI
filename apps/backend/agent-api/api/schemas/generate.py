from pydantic import BaseModel
from typing import Optional, Literal


class Message(BaseModel):
    role: str
    content: str


class ContentOverview(BaseModel):
    learningObjectives: list[str]
    keyConcepts: list[str]


ContentType = Literal["article", "slide", "quiz", "flashcard"]


class TopicInput(BaseModel):
    title: str
    contentOverview: Optional[ContentOverview] = None
    contentType: Optional[ContentType] = None


class GenerateTopicsRequest(BaseModel):
    topic: str
    goal: str
    messages: Optional[list[Message]] = None


class GenerateTopicsResponse(BaseModel):
    title: str
    topics: list[TopicInput]


class ChatMessageRequest(BaseModel):
    message: str
    phase: str
    topic: Optional[str] = None
    goal: Optional[str] = None
    topics: Optional[list[TopicInput]] = None
    messages: Optional[list[Message]] = None


class ChatMessageResponse(BaseModel):
    intent: str
    response: str
    data: Optional[dict] = None


class GenerateTopicsFromChatRequest(BaseModel):
    messages: list[Message]
    content_type: ContentType
