from fastapi import APIRouter, HTTPException, Depends, Header, Request
from fastapi.responses import StreamingResponse, FileResponse, JSONResponse

from app.engine import create_podcast_script, text_to_voice, create_content_suggestions
import json

router = APIRouter()

@router.get("/agent")
async def get_template():
    try:
        with open('/app/app/agent_template.json', 'r') as file:
            template_data = json.load(file)
        return JSONResponse(content=template_data, media_type="application/json")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/config")
async def config(request: Request):
  try:
    params = await request.json()
    return JSONResponse(content={
            "config": "content"
        }, media_type="application/json")
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))

@router.post("/podcast")
async def chat_with_model(request: Request):
  try:
    scheme = request.url.scheme
    netloc = request.url.netloc
    params = await request.json()
    config = params.get("config")
    prompt = params.get("prompt")
    text = create_podcast_script(prompt)

    config_array = config.split(", ")[:2] 
    file_name = config_array[0]
    speaker = config_array[1]
    file_path_full = f"/tmp/voice/{file_name}.wav"
    full_url = f"{scheme}://{netloc}/tmp/voice/{file_name}.wav"

    text_to_voice(text, file_path_full, speaker)
    return JSONResponse(content={
            "full_url": full_url
        }, media_type="application/json")
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))


@router.post("/article")
async def chat_llama(request: Request) -> StreamingResponse:
    data = await request.json()
    prompt = data.get("prompt")

    template = '''
    Context: {context}

    Use the following pieces of context to answer the Question: {question}. 
    If you don't know the answer, please answer 'I don't know'
    '''
    prompt = PromptTemplate(input_variables=["question", "context"], template=template)
    final_prompt = prompt.format(question=question, context=search)
    return StreamingResponse(run_llm_stream(final_prompt), media_type="text/event-stream")


@router.post("/suggest")
async def chat_with_model(request: Request):
  try:
    params = await request.json()
    config = params.get("config")
    prompt = params.get("prompt")
    json_res = create_content_suggestions(prompt)

    return JSONResponse(content={"data": json_res}, media_type="application/json")
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))
