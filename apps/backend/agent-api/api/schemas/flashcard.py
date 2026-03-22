from pydantic import BaseModel


class FlashcardContent(BaseModel):
    html: str


class Flashcard(BaseModel):
    id: int
    front: FlashcardContent
    back: FlashcardContent


class FlashcardsResponse(BaseModel):
    flashcards: list[Flashcard]
