from pydantic import BaseModel


class QuizChoice(BaseModel):
    id: str
    text: str


class QuizQuestion(BaseModel):
    id: int
    question: str
    choices: list[QuizChoice]
    correctAnswer: str


class Quiz(BaseModel):
    questions: list[QuizQuestion]


class QuizResponse(BaseModel):
    questions: list[QuizQuestion]
