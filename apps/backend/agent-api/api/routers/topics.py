from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel
from typing import Optional, Literal
import os
import requests
import logging

from api.services import topic_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/spaces", tags=["topics"])


ContentType = Literal["article", "slide", "flashcard", "quiz"]


class ChatMessageRequest(BaseModel):
    message: str
    history: list
    content_type: Optional[ContentType] = None


class ChatMessageResponse(BaseModel):
    message: dict


@router.post("/{space_slug}/topics/{topic_slug}/chat")
def create_or_get_chat(space_slug: str, topic_slug: str):
    try:
        return topic_service.create_chat(space_slug, topic_slug)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{space_slug}/topics/{topic_slug}/chat")
def get_chat(space_slug: str, topic_slug: str):
    try:
        return topic_service.get_chat(space_slug, topic_slug)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post(
    "/{space_slug}/topics/{topic_slug}/chat/message",
    response_model=ChatMessageResponse,
)
def send_chat_message(space_slug: str, topic_slug: str, data: ChatMessageRequest):
    try:
        response = topic_service.send_chat_message(
            space_slug,
            topic_slug,
            data.message,
            data.history,
            data.content_type,
        )

        chat = topic_service.get_chat(space_slug, topic_slug)
        messages = chat.get("messages", [])
        messages.append({"role": "user", "content": data.message})
        messages.append(response)
        topic_service.save_chat(space_slug, topic_slug, messages)

        return ChatMessageResponse(message=response)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{space_slug}/topics/{topic_slug}/chat")
def delete_chat(space_slug: str, topic_slug: str):
    try:
        topic_service.delete_chat(space_slug, topic_slug)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{space_slug}/topics/{topic_slug}/article")
def generate_topic_article(space_slug: str, topic_slug: str):
    try:
        article = topic_service.generate_topic_article(space_slug, topic_slug)
        return {"content": article}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{space_slug}/topics/{topic_slug}/article")
def get_topic_article(space_slug: str, topic_slug: str):
    try:
        article = topic_service.get_topic_article(space_slug, topic_slug)
        return {"content": article}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{space_slug}/topics/{topic_slug}/slide")
def generate_topic_slide(space_slug: str, topic_slug: str):
    try:
        slide = topic_service.generate_topic_slide(space_slug, topic_slug)
        return {"content": slide}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{space_slug}/topics/{topic_slug}/slide")
def get_topic_slide(space_slug: str, topic_slug: str):
    try:
        slide = topic_service.get_topic_slide(space_slug, topic_slug)
        return {"content": slide}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{space_slug}/topics/{topic_slug}/slide/url")
def get_topic_slide_url(space_slug: str, topic_slug: str):
    try:
        logger.debug(f"[Slide URL] Getting slide URL for {space_slug}/{topic_slug}")
        url = topic_service.get_topic_slide_server(space_slug, topic_slug)
        logger.debug(f"[Slide URL] Returning URL: {url}")
        return {"url": url}
    except Exception as e:
        logger.error(
            f"[Slide URL] Error getting slide URL for {space_slug}/{topic_slug}: {e}"
        )
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{space_slug}/topics/{topic_slug}/slide/")
def proxy_slide_root(space_slug: str, topic_slug: str, request: Request):
    try:
        url, port = topic_service.get_slidev_url(space_slug, topic_slug)
        target_url = url

        resp = requests.get(
            target_url,
            headers={k: v for k, v in request.headers.items() if k.lower() != "host"},
            stream=True,
        )

        return StreamingResponse(
            resp.iter_content(),
            status_code=resp.status_code,
            headers=dict(resp.headers),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{space_slug}/topics/{topic_slug}/slide/{full_path:path}")
def proxy_slide(space_slug: str, topic_slug: str, full_path: str, request: Request):
    try:
        url, port = topic_service.get_slidev_url(space_slug, topic_slug)
        target_url = f"{url}/{full_path}"

        resp = requests.get(
            target_url,
            headers={k: v for k, v in request.headers.items() if k.lower() != "host"},
            stream=True,
        )

        return StreamingResponse(
            resp.iter_content(),
            status_code=resp.status_code,
            headers=dict(resp.headers),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
