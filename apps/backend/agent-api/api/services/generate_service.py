import json
import re
import requests
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from api.schemas.settings import Settings
    from api.schemas.generate import Message


def load_settings() -> "Settings":
    from api.services.settings_service import load_settings

    return load_settings()


class GenerateResult:
    def __init__(self, title: str, topics: list):
        self.title = title
        self.topics = topics


class ChatResult:
    def __init__(self, intent: str, response: str, data: Optional[dict] = None):
        self.intent = intent
        self.response = response
        self.data = data or {}


def _format_conversation_history(messages) -> str:
    if not messages:
        return "No previous conversation."
    history_parts = []
    for msg in messages:
        role = "User" if msg.role == "user" else "Assistant"
        history_parts.append(f"{role}: {msg.content}")
    return "\n".join(history_parts)


def _load_generate_prompt() -> str:
    from api.services.prompt_service import load_prompt

    return load_prompt("role/spec-agent")


def _load_create_topic_prompt() -> str:
    from api.services.prompt_service import load_prompt

    return load_prompt("role/create-topic-gen")


def generate_topics(
    topic: str,
    goal: str,
    messages: Optional[list["Message"]] = None,
    topic_count: Optional[int] = None,
    phase: str = "goal",
) -> GenerateResult:
    settings = load_settings()

    provider = None
    if (
        settings.openrouter
        and settings.openrouter.enabled
        and settings.openrouter.apiKey
    ):
        provider = "openrouter"
    elif settings.custom and settings.custom.enabled and settings.custom.apiKey:
        provider = "custom"

    if not provider:
        raise ValueError("No LLM provider configured.")

    conversation_history = (
        _format_conversation_history(messages)
        if messages
        else "No previous conversation."
    )
    system_prompt = _load_generate_prompt()

    if provider == "openrouter":
        return _generate_with_openrouter(
            topic,
            goal,
            conversation_history,
            settings.openrouter.apiKey,
            settings.openrouter.model,
            system_prompt,
            phase=phase,
        )
    elif provider == "custom":
        return _generate_with_custom(
            topic,
            goal,
            conversation_history,
            settings.custom.url,
            settings.custom.apiKey,
            settings.custom.model,
            system_prompt,
            phase=phase,
        )

    raise ValueError("Failed to generate topics")


def process_chat_message(
    message: str,
    phase: str,
    topic: Optional[str] = None,
    goal: Optional[str] = None,
    topics: Optional[list] = None,
    messages: Optional[list["Message"]] = None,
) -> ChatResult:
    settings = load_settings()

    provider = None
    if (
        settings.openrouter
        and settings.openrouter.enabled
        and settings.openrouter.apiKey
    ):
        provider = "openrouter"
    elif settings.custom and settings.custom.enabled and settings.custom.apiKey:
        provider = "custom"

    if not provider:
        raise ValueError("No LLM provider configured.")

    conversation_history = (
        _format_conversation_history(messages)
        if messages
        else "No previous conversation."
    )
    system_prompt = _load_generate_prompt()

    context = {"topic": topic or "", "goal": goal or "", "topics": topics or []}

    if provider == "openrouter":
        return _chat_with_openrouter(
            message=message,
            phase=phase,
            context=context,
            conversation_history=conversation_history,
            api_key=settings.openrouter.apiKey,
            model=settings.openrouter.model,
            system_prompt_template=system_prompt,
        )
    elif provider == "custom":
        return _chat_with_custom(
            message=message,
            phase=phase,
            context=context,
            conversation_history=conversation_history,
            api_key=settings.custom.apiKey,
            model=settings.custom.model,
            url=settings.custom.url,
            system_prompt_template=system_prompt,
        )

    raise ValueError("Failed to process message")


def _generate_with_openrouter(
    topic: str,
    goal: str,
    conversation_history: str,
    api_key: str,
    model: str,
    system_prompt_template: str,
    phase: str = "goal",
) -> GenerateResult:
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
    }

    system_prompt = system_prompt_template.format(
        conversation_history=conversation_history
    )

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Generate learning topics for {topic}"},
        ],
        "temperature": 0.7,
    }

    response = requests.post(url, headers=headers, json=payload, timeout=30)
    if not response.ok:
        raise ValueError(f"OpenRouter API error: {response.status_code}")

    data = response.json()
    content = data["choices"][0]["message"]["content"]
    return _parse_topics(content)


def _generate_with_custom(
    topic: str,
    goal: str,
    conversation_history: str,
    url: str,
    api_key: str,
    model: str,
    system_prompt_template: str,
    phase: str = "goal",
) -> GenerateResult:
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

    system_prompt = system_prompt_template.format(
        conversation_history=conversation_history
    )

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Generate learning topics for {topic}"},
        ],
        "temperature": 0.7,
    }

    response = requests.post(url, headers=headers, json=payload, timeout=30)
    if not response.ok:
        raise ValueError(f"Custom provider API error: {response.status_code}")

    data = response.json()
    content = data["choices"][0]["message"]["content"]
    return _parse_topics(content)


def _chat_with_openrouter(
    message: str,
    phase: str,
    context: dict,
    conversation_history: str,
    api_key: str,
    model: str,
    system_prompt_template: str,
) -> ChatResult:
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
    }

    system_prompt = system_prompt_template.format(
        conversation_history=conversation_history
    )

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message},
        ],
        "temperature": 0.7,
    }

    response = requests.post(url, headers=headers, json=payload, timeout=30)
    if not response.ok:
        raise ValueError(f"OpenRouter API error: {response.status_code}")

    data = response.json()
    content = data["choices"][0]["message"]["content"]
    return _parse_chat_response(content)


def _chat_with_custom(
    message: str,
    phase: str,
    context: dict,
    conversation_history: str,
    api_key: str,
    model: str,
    url: str,
    system_prompt_template: str,
) -> ChatResult:
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

    system_prompt = system_prompt_template.format(
        conversation_history=conversation_history
    )

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message},
        ],
        "temperature": 0.7,
    }

    response = requests.post(url, headers=headers, json=payload, timeout=30)
    if not response.ok:
        raise ValueError(f"Custom provider API error: {response.status_code}")

    data = response.json()
    content = data["choices"][0]["message"]["content"]
    return _parse_chat_response(content)


def _parse_topics(content: str) -> GenerateResult:
    try:
        content = content.strip()
        if content.startswith("```json"):
            content = content[7:]
        elif content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()

        data = json.loads(content)
        if isinstance(data, dict) and "data" in data:
            data = data["data"]

        title = (
            data.get("title", "Learning Topics")
            if isinstance(data, dict)
            else "Learning Topics"
        )
        topics = data.get("topics", []) if isinstance(data, dict) else []

        if not isinstance(title, str):
            title = "Learning Topics"

        processed = []
        for t in topics:
            if isinstance(t, dict):
                processed.append(
                    {
                        "title": str(t.get("title", "Topic"))
                        if t.get("title")
                        else "Topic",
                        "contentOverview": t.get("contentOverview")
                        or {"learningObjectives": [], "keyConcepts": []},
                        "contentType": str(t.get("contentType", "article"))
                        if t.get("contentType")
                        else "article",
                    }
                )
            elif isinstance(t, str):
                processed.append(
                    {
                        "title": t,
                        "contentOverview": {
                            "learningObjectives": [],
                            "keyConcepts": [],
                        },
                        "contentType": "article",
                    }
                )

        if not processed:
            raise ValueError("No topics")
        return GenerateResult(title=title, topics=processed)
    except Exception:
        return GenerateResult(
            title="Learning Topics",
            topics=[
                {
                    "title": "Topic 1",
                    "contentOverview": {
                        "learningObjectives": ["Learn basics"],
                        "keyConcepts": ["Concept 1"],
                    },
                    "contentType": "article",
                },
                {
                    "title": "Topic 2",
                    "contentOverview": {
                        "learningObjectives": ["Learn more"],
                        "keyConcepts": ["Concept 2"],
                    },
                    "contentType": "article",
                },
                {
                    "title": "Topic 3",
                    "contentOverview": {
                        "learningObjectives": ["Master topic"],
                        "keyConcepts": ["Concept 3"],
                    },
                    "contentType": "article",
                },
            ],
        )


def _parse_chat_response(content: str) -> ChatResult:
    original_content = content
    content = content.strip()

    code_block_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", content, re.DOTALL)
    if code_block_match:
        try:
            data = json.loads(code_block_match.group(1))
            return ChatResult(
                intent=data.get("intent", "greeting"),
                response=data.get("response", ""),
                data=data.get("data", {}),
            )
        except:
            pass

    json_start = content.find("{")
    json_end = content.rfind("}")
    if json_start != -1 and json_end != -1 and json_end > json_start:
        try:
            data = json.loads(content[json_start : json_end + 1])
            return ChatResult(
                intent=data.get("intent", "greeting"),
                response=data.get("response", ""),
                data=data.get("data", {}),
            )
        except:
            pass

    return ChatResult(intent="greeting", response=original_content, data={})


def generate_topics_from_chat(
    messages: list["Message"], content_type: str
) -> GenerateResult:
    settings = load_settings()

    provider = None
    if (
        settings.openrouter
        and settings.openrouter.enabled
        and settings.openrouter.apiKey
    ):
        provider = "openrouter"
    elif settings.custom and settings.custom.enabled and settings.custom.apiKey:
        provider = "custom"

    if not provider:
        raise ValueError("No LLM provider configured.")

    conversation_summary = _format_conversation_history(messages)

    prompt_template = _load_create_topic_prompt()
    prompt = prompt_template.format(
        conversation_summary=conversation_summary,
        content_type=content_type,
        topic_name="the subject",
    )

    if provider == "openrouter":
        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {settings.openrouter.apiKey}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5173",
        }
        model = settings.openrouter.model
    else:
        url = settings.custom.url
        headers = {
            "Authorization": f"Bearer {settings.custom.apiKey}",
            "Content-Type": "application/json",
        }
        model = settings.custom.model

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": ""},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.7,
    }

    response = requests.post(url, headers=headers, json=payload, timeout=60)
    if not response.ok:
        raise ValueError(f"{provider.title()} API error: {response.status_code}")

    data = response.json()
    content = data["choices"][0]["message"]["content"]
    return _parse_topics(content)
