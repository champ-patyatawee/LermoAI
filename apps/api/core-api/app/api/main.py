from fastapi import APIRouter, HTTPException, Depends, Header, Request
from fastapi.responses import StreamingResponse, FileResponse

from app.engine import create_podcast_script, text_to_voice

router = APIRouter()

@router.post("/podcast")
async def chat_with_model(request: Request):
  try:
    params = await request.json()
    prompt = params.get("prompt")
    content = params.get("content")
    text = create_podcast_script(content)

    prompt_array = prompt.split(", ")[:2] 
    file_name = prompt_array[0]
    speaker = prompt_array[1]
    file_path_full = f"/tmp/voice/{file_name}.wav"

    text_to_voice(text, file_path_full, speaker)
    return FileResponse(path=file_path_full, media_type="audio/wav", filename=f"{file_name}.wav")
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))