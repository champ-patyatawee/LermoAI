from fastapi import APIRouter

router = APIRouter()

@router.get("/ping")
async def pong():
    return {"ping": "pong!"}