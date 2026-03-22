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
                    "quiz": False,
                }
            topic["contents"][content_type] = value
            break

    with open(space_file, "w") as f:
        json.dump(space_data, f, indent=2)


def generate_topic_quiz(space_slug: str, topic_slug: str) -> list[dict]:
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

    quiz_prompt = load_prompt("role/quiz-agent")
    if not quiz_prompt:
        raise ValueError(
            "Create Quiz Prompt not configured. Please set it in Settings."
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

    system_prompt = quiz_prompt.format(topic_title=topic_title)

    user_message = f"Generate a quiz about {topic_title}"
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

    def parse_json_response(content: str) -> dict:
        content = content.strip()

        # Handle empty or very short responses
        if not content or len(content) < 10:
            raise ValueError(f"Response too short: {content}")

        # Handle the case where content is a JSON string (escaped)
        # e.g. "\"{\\\"questions\\\": [...]}\""
        if content.startswith('"') and content.endswith('"'):
            try:
                # Try to unescape and parse
                unescaped = content[1:-1]
                unescaped = unescaped.encode().decode("unicode_escape")
                return json.loads(unescaped)
            except Exception:
                pass

        # Try to extract JSON from markdown code blocks
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]

        content = content.strip()

        try:
            return json.loads(content)
        except json.JSONDecodeError:
            pass

        # Try to find JSON object in the response
        import re

        # Look for {"questions": [...]} pattern
        json_match = re.search(r'\{"questions":\s*\[.*\]', content, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group())
            except json.JSONDecodeError:
                pass

        # Try to find questions array and wrap it
        questions_match = re.search(r'\["questions",\s*\[(.*)\]\]', content, re.DOTALL)
        if questions_match:
            try:
                # Try to find valid JSON starting from the beginning
                start = content.find("{")
                if start >= 0:
                    return json.loads(content[start:])
            except:
                pass

        raise ValueError(f"Could not parse JSON from response: {content[:200]}")

    try:
        quiz_data = parse_json_response(content)
    except ValueError as e:
        raise ValueError(f"Invalid quiz format returned: {str(e)}")

    if not isinstance(quiz_data, dict):
        raise ValueError("Invalid quiz format returned")

    if "questions" not in quiz_data:
        raise ValueError("Quiz must have 'questions' field")

    questions = quiz_data["questions"]
    if not isinstance(questions, list):
        raise ValueError("Questions must be a list")

    for i, q in enumerate(questions):
        q["id"] = i + 1
        if "choices" not in q or len(q["choices"]) != 4:
            raise ValueError(f"Question {i + 1} must have exactly 4 choices")
        for j, choice in enumerate(q["choices"]):
            choice["id"] = chr(ord("a") + j)
        if "correctAnswer" not in q:
            raise ValueError(f"Question {i + 1} must have 'correctAnswer' field")

    topic_path = _ensure_topic_folder(space_slug, topic_slug)
    quiz_file = os.path.join(topic_path, "quiz.json")

    with open(quiz_file, "w") as f:
        json.dump(quiz_data, f, indent=2)

    _update_topic_content_flag(space_slug, topic_slug, "quiz", True)

    return questions


def get_topic_quiz(space_slug: str, topic_slug: str) -> list[dict]:
    topic_path = _get_topic_path(space_slug, topic_slug)
    quiz_file = os.path.join(topic_path, "quiz.json")

    if not os.path.exists(quiz_file):
        return {"questions": []}

    with open(quiz_file, "r") as f:
        return json.load(f)


def delete_topic_quiz(space_slug: str, topic_slug: str) -> None:
    topic_path = _get_topic_path(space_slug, topic_slug)
    quiz_file = os.path.join(topic_path, "quiz.json")

    if os.path.exists(quiz_file):
        os.remove(quiz_file)

    _update_topic_content_flag(space_slug, topic_slug, "quiz", False)
