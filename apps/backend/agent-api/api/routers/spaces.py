from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Union, Any
from pydantic import BaseModel

from api.schemas.space import (
    Space,
    SpaceCreate,
    SpaceUpdate,
    SpaceWithTopics,
    TopicCreate,
    Topic,
    PaginatedSpaces,
)
from api.services import space_service

router = APIRouter(prefix="/api/spaces", tags=["spaces"])


class TopicInputItem(BaseModel):
    title: str
    contentOverview: Optional[dict] = None
    contentType: Optional[str] = None


class SpaceWithTopicsCreate(BaseModel):
    title: str
    description: str = ""
    topics: List[Any]


@router.get("", response_model=PaginatedSpaces)
def list_spaces(limit: int = Query(10, ge=1, le=50), offset: int = Query(0, ge=0)):
    return space_service.list_spaces(limit=limit, offset=offset)


@router.post("", response_model=Space, status_code=201)
def create_space(data: SpaceCreate):
    try:
        return space_service.create_space(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{slug}", response_model=SpaceWithTopics)
def get_space(slug: str):
    space = space_service.get_space(slug)
    if not space:
        raise HTTPException(status_code=404, detail="Space not found")
    return space


@router.put("/{slug}", response_model=SpaceWithTopics)
def update_space(slug: str, data: SpaceUpdate):
    space = space_service.update_space(slug, data)
    if not space:
        raise HTTPException(status_code=404, detail="Space not found")
    return space


@router.delete("/{slug}", status_code=204)
def delete_space(slug: str):
    if not space_service.delete_space(slug):
        raise HTTPException(status_code=404, detail="Space not found")


@router.post("/{slug}/topics", response_model=Topic, status_code=201)
def create_topic(slug: str, data: TopicCreate):
    topic = space_service.create_topic(slug, data)
    if not topic:
        raise HTTPException(status_code=404, detail="Space not found")
    return topic


@router.post("/with-topics", response_model=SpaceWithTopics, status_code=201)
def create_space_with_topics(data: SpaceWithTopicsCreate):
    try:
        return space_service.create_space_with_topics(
            data.title, data.description, data.topics
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
