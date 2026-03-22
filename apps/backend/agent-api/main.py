from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routers import spaces, settings, generate, topics, flashcards, quiz

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(spaces.router)
app.include_router(settings.router)
app.include_router(generate.router)
app.include_router(topics.router)
app.include_router(flashcards.router)
app.include_router(quiz.router)


@app.get("/")
def read_root():
    return {"message": "Lermo AI 2026 API", "status": "running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
