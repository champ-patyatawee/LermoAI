# LermoAI

Lermo is a AI Agent for Personalized Learning 

# Releases
### Release v0.0.1

- Agent Role
- Articel Gen
- Podcast Gen

Support Provider
- OpenAI,
- OpenSource LLM
  - Mistral
  - LLama

### Release v0.0.2
- Groq Support
- Learning Path
- Chat Agent

### Release v0.0.3
- Video Gen (Beta)

### Release v0.0.4
- Custom Agent
- Search Agent

# Getting Started

Requires
- NodeJs
- NextJs
- React
- Python

## Local

### Web

```sh
cd apps/frontend/apps/lermo-gen-web

# Install Dependencies
pnpm i

# Start
pnpm run dev
```

### API
```sh
cd apps/api/core-api

# Install Dependencies
pip install -r requirements.txt
pip install git+https://github.com/myshell-ai/MeloTTS.git
python -m unidic download

# Start
python main.py
```

### LLM

OpenAI Support

```
export OPENAI_API_KEY=sk-xxxx
```


Self hosted LLM Llama, Mistral support.
[README](apps/llm/README.md)





# docker


```
Docker compose
```