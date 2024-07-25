from fastapi import APIRouter, HTTPException, Depends, Header, Request
from fastapi.responses import StreamingResponse, FileResponse, JSONResponse

from app.engine import create_podcast_script, text_to_voice, create_content_suggestions, create_article, config_agent
import json
import logging

router = APIRouter()

@router.get("/agent")
async def get_template():
  try:
      with open('/app/app/agent_template.json', 'r') as file:
          template_data = json.load(file)
      return JSONResponse(content={"data": template_data}, media_type="application/json")
  except Exception as e:
    logging.basicConfig(level=logging.ERROR, format='%(asctime)s - %(levelname)s - %(message)s')
    logging.error(f"An error occurred: {e}")
    raise HTTPException(status_code=500, detail=str(e))

@router.post("/agent")
async def update_agent(request: Request):
  try:
    params = await request.json()
    with open('/app/app/agent_template.json', 'w') as file:
        json.dump(params, file)
    return JSONResponse(content={
            "config": "content"
        }, media_type="application/json")
  except Exception as e:
    logging.basicConfig(level=logging.ERROR, format='%(asctime)s - %(levelname)s - %(message)s')
    logging.error(f"An error occurred: {e}")
    raise HTTPException(status_code=500, detail=str(e))


@router.put("/config")
async def update_config(request: Request):
    try:
        params = await request.json()
        print(params)
        if all(param == "" for param in [params.get(key, "") for key in ["agentName", "voiceName", "podcastName", "podcastSpeed"]]):
            return JSONResponse(content={"message": "No changes to apply."}, media_type="application/json")

        # Read the existing configuration
        try:
            with open('/app/app/config.json', 'r') as file:
                existing_config = json.load(file)
        except FileNotFoundError:
            existing_config = {}

        # Merge the existing configuration with the new values
        new_config = {**existing_config, **{key: params[key] for key in ["agentName", "voiceName", "podcastName", "podcastSpeed"] if params.get(key)}}

        # Write the merged configuration back to the file
        with open('/app/app/config.json', 'w') as file:
            json.dump(new_config, file)

        config_agent()

        return JSONResponse(content={"message": "Configuration updated successfully.", "data": new_config}, media_type="application/json")
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/podcast")
async def chat_llama(request: Request) -> StreamingResponse:
  try:
      data = await request.json()
      prompt = data.get("prompt")
      
      scheme = request.url.scheme
      netloc = request.url.netloc

      text = create_podcast_script(prompt)
      filePath = text_to_voice(text)
      full_url = f"{scheme}://{netloc}{filePath}"

      return JSONResponse(content={
        "full_url": full_url
      }, media_type="application/json")
  except Exception as e:
    logging.basicConfig(level=logging.ERROR, format='%(asctime)s - %(levelname)s - %(message)s')
    logging.error(f"An error occurred: {e}")
    raise HTTPException(status_code=500, detail=str(e))


@router.post("/article")
async def chat_llama(request: Request) -> StreamingResponse:
  try:
      data = await request.json()
      prompt = data.get("prompt")
      article_content = create_article(prompt)
      return JSONResponse(content={"data": f"{article_content}"}, media_type="application/json")
  except Exception as e:
    logging.basicConfig(level=logging.ERROR, format='%(asctime)s - %(levelname)s - %(message)s')
    logging.error(f"An error occurred: {e}")
    raise HTTPException(status_code=500, detail=str(e))

  
@router.post("/suggest")
async def chat_with_model(request: Request):
  try:
    params = await request.json()
    config = params.get("config")
    prompt = params.get("prompt")
    json_res = create_content_suggestions(prompt)

    return JSONResponse(content={"data": json_res}, media_type="application/json")
  except Exception as e:
    logging.basicConfig(level=logging.ERROR, format='%(asctime)s - %(levelname)s - %(message)s')
    logging.error(f"An error occurred: {e}")
    raise HTTPException(status_code=500, detail=str(e))
