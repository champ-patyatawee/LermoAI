from fastapi import APIRouter, HTTPException

from api.schemas.generate import (
    GenerateTopicsRequest,
    GenerateTopicsResponse,
    TopicInput,
    ChatMessageRequest,
    ChatMessageResponse,
    GenerateTopicsFromChatRequest,
)
from api.services import generate_service

router = APIRouter(prefix="/api", tags=["generate"])


@router.post("/generate-topics", response_model=GenerateTopicsResponse)
def generate_topics(data: GenerateTopicsRequest):
    try:
        result = generate_service.generate_topics(data.topic, data.goal, data.messages)

        topics = []
        for t in result.topics:
            if isinstance(t, dict):
                topics.append(
                    TopicInput(
                        title=t.get("title", "Untitled"),
                        contentOverview=t.get("contentOverview"),
                        contentType=t.get("contentType"),
                    )
                )
            elif hasattr(t, "title"):
                topics.append(
                    TopicInput(
                        title=t.title,
                        contentOverview=t.contentOverview
                        if hasattr(t, "contentOverview")
                        else None,
                        contentType=t.contentType
                        if hasattr(t, "contentType")
                        else None,
                    )
                )

        return GenerateTopicsResponse(title=result.title, topics=topics)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to generate topics: {str(e)}"
        )


@router.post("/chat-message", response_model=ChatMessageResponse)
def chat_message(data: ChatMessageRequest):
    try:
        topic_inputs = None
        if data.topics:
            topic_inputs = [t.dict() for t in data.topics]

        result = generate_service.process_chat_message(
            message=data.message,
            phase=data.phase,
            topic=data.topic,
            goal=data.goal,
            topics=topic_inputs,
            messages=data.messages,
        )

        return ChatMessageResponse(
            intent=result.intent,
            response=result.response,
            data=result.data,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to process message: {str(e)}"
        )


@router.post("/generate-topics-from-chat", response_model=GenerateTopicsResponse)
def generate_topics_from_chat(data: GenerateTopicsFromChatRequest):
    try:
        result = generate_service.generate_topics_from_chat(
            messages=data.messages,
            content_type=data.content_type,
        )

        topics = []
        for t in result.topics:
            if isinstance(t, dict):
                topics.append(
                    TopicInput(
                        title=t.get("title", "Untitled"),
                        contentOverview=t.get("contentOverview"),
                        contentType=t.get("contentType"),
                    )
                )
            elif hasattr(t, "title"):
                topics.append(
                    TopicInput(
                        title=t.title,
                        contentOverview=t.contentOverview
                        if hasattr(t, "contentOverview")
                        else None,
                        contentType=t.contentType
                        if hasattr(t, "contentType")
                        else None,
                    )
                )

        return GenerateTopicsResponse(title=result.title, topics=topics)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to generate topics from chat: {str(e)}"
        )
