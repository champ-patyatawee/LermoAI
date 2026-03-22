from fastapi import APIRouter, HTTPException

from api.services import flashcard_service

router = APIRouter(prefix="/api/spaces", tags=["flashcards"])


@router.post("/{space_slug}/topics/{topic_slug}/flashcards")
def generate_flashcards(space_slug: str, topic_slug: str):
    try:
        flashcards = flashcard_service.generate_topic_flashcards(space_slug, topic_slug)
        return {"flashcards": flashcards}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{space_slug}/topics/{topic_slug}/flashcards")
def get_flashcards(space_slug: str, topic_slug: str):
    try:
        flashcards = flashcard_service.get_topic_flashcards(space_slug, topic_slug)
        return {"flashcards": flashcards}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{space_slug}/topics/{topic_slug}/flashcards")
def delete_flashcards(space_slug: str, topic_slug: str):
    try:
        flashcard_service.delete_topic_flashcards(space_slug, topic_slug)
        return {"message": "Flashcards deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
