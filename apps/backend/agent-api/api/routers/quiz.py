from fastapi import APIRouter, HTTPException

from api.services import quiz_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/spaces", tags=["quiz"])


@router.post("/{space_slug}/topics/{topic_slug}/quiz")
def generate_quiz(space_slug: str, topic_slug: str):
    try:
        questions = quiz_service.generate_topic_quiz(space_slug, topic_slug)
        return {"questions": questions}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{space_slug}/topics/{topic_slug}/quiz")
def get_quiz(space_slug: str, topic_slug: str):
    try:
        quiz_data = quiz_service.get_topic_quiz(space_slug, topic_slug)
        return quiz_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{space_slug}/topics/{topic_slug}/quiz")
def delete_quiz(space_slug: str, topic_slug: str):
    try:
        quiz_service.delete_topic_quiz(space_slug, topic_slug)
        return {"message": "Quiz deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
