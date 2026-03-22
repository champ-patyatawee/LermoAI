import json
import logging
import os
import requests

logger = logging.getLogger(__name__)

STORAGE_PATH = os.environ.get("STORAGE_PATH", "./storage")


def _get_space_path(space_slug: str) -> str:
    return os.path.join(STORAGE_PATH, "spaces", space_slug)


def _get_topic_path(space_slug: str, topic_slug: str) -> str:
    return os.path.join(_get_space_path(space_slug), "topics", topic_slug)


def _ensure_topic_folder(space_slug: str, topic_slug: str) -> str:
    topic_path = _get_topic_path(space_slug, topic_slug)
    os.makedirs(topic_path, exist_ok=True)
    return topic_path


def _send_openrouter_message(messages: list, api_key: str, model: str) -> dict:
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
    }

    payload = {
        "model": model,
        "messages": messages,
        "temperature": 0.7,
    }

    response = requests.post(url, headers=headers, json=payload, timeout=120)

    if not response.ok:
        raise ValueError(f"OpenRouter API error: {response.status_code}")

    data = response.json()
    content = data["choices"][0]["message"]["content"]

    return {"role": "assistant", "content": content}


def _send_custom_message(messages: list, url: str, api_key: str, model: str) -> dict:
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": model,
        "messages": messages,
        "temperature": 0.7,
    }

    response = requests.post(url, headers=headers, json=payload, timeout=120)

    if not response.ok:
        raise ValueError(f"Custom provider API error: {response.status_code}")

    data = response.json()
    content = data["choices"][0]["message"]["content"]

    return {"role": "assistant", "content": content}


def _update_topic_content_flag(
    space_slug: str, topic_slug: str, content_type: str, value: bool
) -> None:
    space_file = os.path.join(_get_space_path(space_slug), "space.json")

    with open(space_file, "r") as f:
        space_data = json.load(f)

    for topic in space_data.get("topics", []):
        if topic.get("slug") == topic_slug:
            if "contents" not in topic:
                topic["contents"] = {
                    "article": False,
                    "slide": False,
                    "flashcard": False,
                }
            topic["contents"][content_type] = value
            break

    with open(space_file, "w") as f:
        json.dump(space_data, f, indent=2)


def generate_topic_flashcards(space_slug: str, topic_slug: str) -> list[dict]:
    from api.services.settings_service import load_settings

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
        raise ValueError("No LLM provider configured")

    from api.services.prompt_service import load_prompt

    flashcard_prompt = load_prompt("role/flashcard-agent")
    if not flashcard_prompt:
        raise ValueError(
            "Create Flashcard Prompt not configured. Please set it in Settings."
        )

    space_file = os.path.join(_get_space_path(space_slug), "space.json")

    with open(space_file, "r") as f:
        space_data = json.load(f)

    topic_title = topic_slug
    content_overview = None
    for t in space_data.get("topics", []):
        if t.get("slug") == topic_slug:
            topic_title = t.get("title", topic_slug)
            content_overview = t.get("contentOverview")
            break

    context_str = ""
    if content_overview:
        learning_obj = content_overview.get("learningObjectives", [])
        key_concepts = content_overview.get("keyConcepts", [])
        if learning_obj:
            context_str += "\n\n## Learning Objectives:\n"
            for obj in learning_obj:
                context_str += f"- {obj}\n"
        if key_concepts:
            context_str += "\n## Key Concepts:\n"
            for concept in key_concepts:
                context_str += f"- {concept}\n"

    system_prompt = flashcard_prompt.format(topic_title=topic_title)

    user_message = f"Generate flashcards about {topic_title}"
    if context_str:
        user_message += f"\n\n{context_str}"

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message},
    ]

    if provider == "openrouter":
        response = _send_openrouter_message(
            messages, settings.openrouter.apiKey, settings.openrouter.model
        )
    else:
        response = _send_custom_message(
            messages, settings.custom.url, settings.custom.apiKey, settings.custom.model
        )

    content = response["content"]

    try:
        flashcards = json.loads(content)
    except json.JSONDecodeError:
        content = content.strip()
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        flashcards = json.loads(content.strip())

    if not isinstance(flashcards, list):
        raise ValueError("Invalid flashcard format returned")

    for i, card in enumerate(flashcards):
        card["id"] = i + 1
        if "front" not in card:
            card["front"] = {"html": ""}
        if "back" not in card:
            card["back"] = {"html": ""}
        if isinstance(card["front"], str):
            card["front"] = {"html": card["front"]}
        if isinstance(card["back"], str):
            card["back"] = {"html": card["back"]}

    topic_path = _ensure_topic_folder(space_slug, topic_slug)
    flashcards_file = os.path.join(topic_path, "flashcards.json")

    with open(flashcards_file, "w") as f:
        json.dump(flashcards, f, indent=2)

    _update_topic_content_flag(space_slug, topic_slug, "flashcard", True)

    return flashcards


def get_topic_flashcards(space_slug: str, topic_slug: str) -> list[dict]:
    topic_path = _get_topic_path(space_slug, topic_slug)
    flashcards_file = os.path.join(topic_path, "flashcards.json")

    if not os.path.exists(flashcards_file):
        return []

    with open(flashcards_file, "r") as f:
        return json.load(f)


def delete_topic_flashcards(space_slug: str, topic_slug: str) -> None:
    topic_path = _get_topic_path(space_slug, topic_slug)
    flashcards_file = os.path.join(topic_path, "flashcards.json")

    if os.path.exists(flashcards_file):
        os.remove(flashcards_file)

    _update_topic_content_flag(space_slug, topic_slug, "flashcard", False)
