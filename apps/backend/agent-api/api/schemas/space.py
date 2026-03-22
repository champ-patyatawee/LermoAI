from typing import Optional, Literal
from pydantic import BaseModel
from datetime import datetime


ContentType = Literal["article", "slide", "quiz", "flashcard"]


class ContentOverview(BaseModel):
    learningObjectives: list[str]
    keyConcepts: list[str]


class TopicContent(BaseModel):
    article: bool = False
    slide: bool = False
    flashcard: bool = False
    quiz: bool = False


class TopicBase(BaseModel):
    title: str
    slug: str
    order: int


class TopicCreate(BaseModel):
    title: str
    content_type: Optional[ContentType] = None


class Topic(TopicBase):
    id: str
    contents: TopicContent
    contentOverview: Optional[ContentOverview] = None
    contentType: Optional[ContentType] = None

    class Config:
        from_attributes = True


class SpaceBase(BaseModel):
    title: str
    description: Optional[str] = ""


class SpaceCreate(BaseModel):
    title: str
    description: Optional[str] = ""


class SpaceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


class SpaceContent(BaseModel):
    id: str
    title: str
    slug: str
    description: str
    icon: str
    gradient: str
    created_at: str
    topics: list[Topic] = []


class Space(SpaceBase):
    id: str
    slug: str
    icon: str
    gradient: str
    created_at: str

    class Config:
        from_attributes = True


class SpaceWithTopics(SpaceContent):
    pass


class PaginatedSpaces(BaseModel):
    spaces: list[Space]
    total: int
    limit: int
    offset: int
