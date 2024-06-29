from fastapi import APIRouter, HTTPException, Depends, Header, Request
from fastapi.responses import StreamingResponse, FileResponse, JSONResponse

from app.engine import create_podcast_script, text_to_voice, create_content_suggestions

router = APIRouter()

@router.post("/podcast")
async def chat_with_model(request: Request):
  try:
    params = await request.json()
    config = params.get("config")
    prompt = params.get("prompt")
    text = create_podcast_script(prompt)

    config_array = config.split(", ")[:2] 
    file_name = config_array[0]
    speaker = config_array[1]
    file_path_full = f"/tmp/voice/{file_name}.wav"

    text_to_voice(text, file_path_full, speaker)
    return JSONResponse(content={
            "filePath": file_path_full
        }, media_type="application/json")
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))


@router.post("/suggest")
async def suggest(request: Request):
    params = await request.json()
    print(params)
    config = params.get("config")
    prompt = params.get("prompt")
    json_res = create_content_suggestions(prompt)
    return JSONResponse(content=json_res, media_type="application/json")
