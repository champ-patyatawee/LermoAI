from langchain_openai import ChatOpenAI
from melo.api import TTS
from app.model import Topic
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

llm = None
Agent = None
VOICE_ENGINE = None
device = 'cpu'
def init_engine():
  global llm
  global VOICE_ENGINE
  if not llm:
    llm = ChatOpenAI(model="gpt4", temperature=0)
  if not VOICE_ENGINE:
      VOICE_ENGINE = TTS(language='EN', device=device)

def create_content_suggestions(query: str):
  parser = JsonOutputParser(pydantic_object=Topic)

  prompt = PromptTemplate(
      template="List 3 learning topics based on query.\n{format_instructions}\n {query}\n",
      input_variables=["query"],
      partial_variables={"format_instructions": parser.get_format_instructions()},
  )

  chain = prompt | llm | parser
  result = chain.invoke({"query": query})
  return result

def create_podcast_script(content: str):
  prompt = """
  Go deep into {content} and explain like human talk max 300 words.
  """
  result = llm.invoke(prompt.format(content=content))
  return result.content

# def create_article(content: str):

def text_to_voice(text: str, file_path: str, speaker: str):
    speed = 1
    speaker_ids = VOICE_ENGINE.hps.data.spk2id
    VOICE_ENGINE.tts_to_file(text, speaker_ids[speaker], file_path, speed=speed)
    print("Voice Generated")