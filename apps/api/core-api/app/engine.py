from langchain_openai import ChatOpenAI
from melo.api import TTS
from app.model import Topic
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
import json
import logging

llm = None
agent = None
VOICE_ENGINE = None
device = 'cpu'
def init_engine():
  global llm
  global agent
  global VOICE_ENGINE

  config_data = json.load(open('/app/app/config.json', 'r'))
  template_data = json.load(open('/app/app/agent_template.json', 'r'))
  agent = list(filter(lambda x:x["name"]==config_data.get("agentName"),template_data))

  if not llm:
    llm = ChatOpenAI(model="gpt-4-turbo", temperature=0)
  if not VOICE_ENGINE:
    VOICE_ENGINE = TTS(language='EN', device=device)

def create_content_suggestions(query: str):
    parser = JsonOutputParser(pydantic_object=Topic)
    print(agent)
    # template = f"""
    #     Name: {agent[0]['name']}\n
    #     Role: {agent[0]['role']}\n
    #     Personality: {agent[0]['personality']}\n
    #     Areas: {agent[0]['areas']}\n
    #     Style: {agent[0]['style']}\n
    #     Task: List 5 learning topics based on query.\n{{format_instructions}}\n {{query}}\n
    # """

    template = f"""
        Name: {agent[0]['name']}\n
        Role: {agent[0]['role']}\n
        Personality: {agent[0]['personality']}\n
        Task: List 5 learning topics based on query.\n{{format_instructions}}\n {{query}}\n
    """

    prompt = PromptTemplate(
        template=template,
        # template="List 3 learning topics based on query.\n{format_instructions}\n {query}\n",
        input_variables=["query"],
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )

    print(prompt)
    try:
        chain = prompt | llm | parser
        result = chain.invoke({"query": query})
        return result
    except Exception as e:
        logging.basicConfig(level=logging.ERROR, format='%(asctime)s - %(levelname)s - %(message)s')
        logging.error(f"An error occurred while creating content suggestions: {e}")
        raise
    
def create_podcast_script(content: str):
  prompt = """
  Go deep into {content} and explain like human talk max 300 words.
  """
  result = llm.invoke(prompt.format(content=content))
  return result.content

def text_to_voice(text: str, file_path: str, speaker: str):
    speed = 1
    speaker_ids = VOICE_ENGINE.hps.data.spk2id
    VOICE_ENGINE.tts_to_file(text, speaker_ids[speaker], file_path, speed=speed)
    print("Voice Generated")