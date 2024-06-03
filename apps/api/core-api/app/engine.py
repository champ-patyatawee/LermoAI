from langchain_openai import ChatOpenAI
from melo.api import TTS


llm = None
VOICE_ENGINE = None
device = 'cpu'
def init_engine():
  global llm
  global VOICE_ENGINE
  if not llm:
    llm = ChatOpenAI(model="gpt4", temperature=0)
  if not VOICE_ENGINE:
      VOICE_ENGINE = TTS(language='EN', device=device)

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