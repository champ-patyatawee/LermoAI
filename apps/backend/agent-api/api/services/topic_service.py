import json
import logging
import os
import uuid
import requests
from datetime import datetime
from typing import Optional

logger = logging.getLogger(__name__)

STORAGE_PATH = os.environ.get("STORAGE_PATH", "./storage")


def _get_space_path(space_slug: str) -> str:
    return os.path.join(STORAGE_PATH, "spaces", space_slug)


def _get_topic_path(space_slug: str, topic_slug: str) -> str:
    return os.path.join(_get_space_path(space_slug), "topics", topic_slug)


def _get_chat_file(space_slug: str, topic_slug: str) -> str:
    return os.path.join(_get_topic_path(space_slug, topic_slug), "chat.json")


def _ensure_topic_folder(space_slug: str, topic_slug: str) -> str:
    topic_path = _get_topic_path(space_slug, topic_slug)
    os.makedirs(topic_path, exist_ok=True)
    return topic_path


def _generate_welcome_message(topic_title: str, space_title: str) -> str:
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
        return f"Hi! I'm your Q&A assistant for **{topic_title}**. Ask me anything about the content!"

    from api.services.prompt_service import load_prompt

    system_prompt_template = load_prompt("role/chat-agent")
    if not system_prompt_template:
        raise ValueError(
            "Create Chat Prompt not configured. Please set it in Settings."
        )

    system_prompt = system_prompt_template.format(
        topic_title=topic_title, space_title=space_title
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": "Generate a welcome message"},
    ]

    try:
        if provider == "openrouter":
            response = _send_openrouter_message(
                messages, settings.openrouter.apiKey, settings.openrouter.model
            )
        else:
            response = _send_custom_message(
                messages,
                settings.custom.url,
                settings.custom.apiKey,
                settings.custom.model,
            )
        return response["content"]
    except Exception:
        return f"Hi! I'm your Q&A assistant for **{topic_title}**. Ask me anything about the content!"


def create_chat(space_slug: str, topic_slug: str) -> dict:
    _ensure_topic_folder(space_slug, topic_slug)

    chat_file = _get_chat_file(space_slug, topic_slug)

    if os.path.exists(chat_file):
        with open(chat_file, "r") as f:
            chat_data = json.load(f)
        return {
            "id": chat_data.get("id"),
            "title": chat_data.get("title"),
            "created_at": chat_data.get("created_at"),
        }

    _update_topic_content_flag(space_slug, topic_slug, "chat", True)

    space_file = os.path.join(_get_space_path(space_slug), "space.json")
    with open(space_file, "r") as f:
        space_data = json.load(f)

    space_title = space_data.get("title", space_slug)
    topic_title = topic_slug
    for t in space_data.get("topics", []):
        if t.get("slug") == topic_slug:
            topic_title = t.get("title", topic_slug)
            break

    chat_id = str(uuid.uuid4())
    created_at = datetime.now().isoformat()

    welcome_message = "Hello! I'm your Lermo AI Agent Assistant. Ask me anything about the learning content!"

    initial_messages = [
        {
            "role": "system",
            "content": f"""You are a Q&A assistant for the topic "{topic_title}" in the learning space "{space_title}".

Your role:
- Answer questions about the learning content
- Keep answers concise and accurate
- Use examples from the content when helpful
- If you don't know the answer from the content, say so
- If the question is not related to the content, politely redirect""",
        },
        {"role": "assistant", "content": welcome_message},
    ]

    chat_data = {
        "id": chat_id,
        "title": "Chat",
        "created_at": created_at,
        "messages": initial_messages,
        "context": {"space_title": space_title, "topic_title": topic_title},
    }

    with open(chat_file, "w") as f:
        json.dump(chat_data, f, indent=2)

    return chat_data


def get_chat(space_slug: str, topic_slug: str) -> dict:
    chat_file = _get_chat_file(space_slug, topic_slug)

    if not os.path.exists(chat_file):
        return create_chat(space_slug, topic_slug)

    with open(chat_file, "r") as f:
        return json.load(f)


def save_chat(space_slug: str, topic_slug: str, messages: list) -> None:
    chat_file = _get_chat_file(space_slug, topic_slug)

    if not os.path.exists(chat_file):
        raise ValueError("Chat not found")

    with open(chat_file, "r") as f:
        chat_data = json.load(f)

    chat_data["messages"] = messages

    with open(chat_file, "w") as f:
        json.dump(chat_data, f, indent=2)


def delete_chat(space_slug: str, topic_slug: str) -> None:
    chat_file = _get_chat_file(space_slug, topic_slug)

    if os.path.exists(chat_file):
        os.remove(chat_file)

    _update_topic_content_flag(space_slug, topic_slug, "chat", False)


def send_chat_message(
    space_slug: str,
    topic_slug: str,
    user_message: str,
    conversation_history: list,
    content_type: Optional[str] = None,
) -> dict:
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

    qa_prompt = load_prompt("role/qa-agent")
    if not qa_prompt:
        raise ValueError("QA Prompt not configured.")

    chat_file = _get_chat_file(space_slug, topic_slug)
    with open(chat_file, "r") as f:
        chat_data = json.load(f)

    context = chat_data.get("context", {})
    space_title = context.get("space_title", space_slug)
    topic_title = context.get("topic_title", topic_slug)

    content_context = ""
    content_label = ""

    if content_type == "article":
        article_content = get_topic_article(space_slug, topic_slug)
        if article_content:
            content_context = article_content
            content_label = "ARTICLE"
    elif content_type == "slide":
        slide_content = get_topic_slide(space_slug, topic_slug)
        if slide_content:
            content_context = slide_content
            content_label = "SLIDE"
    elif content_type == "flashcard":
        from api.services.flashcard_service import get_topic_flashcards

        flashcards = get_topic_flashcards(space_slug, topic_slug)
        if flashcards:
            content_context = json.dumps(flashcards, indent=2)
            content_label = "FLASHCARDS"
    elif content_type == "quiz":
        from api.services.quiz_service import get_topic_quiz

        quiz = get_topic_quiz(space_slug, topic_slug)
        if quiz:
            content_context = json.dumps(quiz, indent=2)
            content_label = "QUIZ"

    system_prompt = qa_prompt.format(
        topic_title=topic_title,
        space_title=space_title,
        content_label=content_label if content_label else "None",
        content_context=content_context if content_context else "No content available",
    )

    messages = [{"role": "system", "content": system_prompt}]
    for msg in conversation_history:
        if msg.get("role") != "system":
            messages.append({"role": msg["role"], "content": msg["content"]})
    messages.append({"role": "user", "content": user_message})

    if provider == "openrouter":
        return _send_openrouter_message(
            messages, settings.openrouter.apiKey, settings.openrouter.model
        )
    else:
        return _send_custom_message(
            messages, settings.custom.url, settings.custom.apiKey, settings.custom.model
        )


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


def generate_topic_article(space_slug: str, topic_slug: str) -> str:
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

    article_prompt = load_prompt("role/article-agent")
    if not article_prompt:
        raise ValueError(
            "Create Article Prompt not configured. Please set it in Settings."
        )

    space_file = os.path.join(_get_space_path(space_slug), "space.json")

    with open(space_file, "r") as f:
        space_data = json.load(f)

    topic_title = topic_slug
    space_title = space_slug
    content_overview = None
    for t in space_data.get("topics", []):
        if t.get("slug") == topic_slug:
            topic_title = t.get("title", topic_slug)
            content_overview = t.get("contentOverview")
            break
    if space_data.get("title"):
        space_title = space_data.get("title")

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

    system_prompt = article_prompt.format(
        topic_title=topic_title, space_title=space_title
    )

    user_message = f"Generate a learning article about {topic_title}"
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

    article_content = response["content"]

    topic_path = _ensure_topic_folder(space_slug, topic_slug)
    article_file = os.path.join(topic_path, "article.md")

    with open(article_file, "w") as f:
        f.write(article_content)

    _update_topic_content_flag(space_slug, topic_slug, "article", True)

    return article_content


def get_topic_article(space_slug: str, topic_slug: str) -> str:
    topic_path = _get_topic_path(space_slug, topic_slug)
    article_file = os.path.join(topic_path, "article.md")

    if not os.path.exists(article_file):
        return ""

    with open(article_file, "r") as f:
        return f.read()


def generate_topic_slide(space_slug: str, topic_slug: str) -> str:
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

    space_file = os.path.join(_get_space_path(space_slug), "space.json")

    with open(space_file, "r") as f:
        space_data = json.load(f)

    topic_title = topic_slug
    space_title = space_data.get("title", space_slug)
    content_overview = None
    for t in space_data.get("topics", []):
        if t.get("slug") == topic_slug:
            topic_title = t.get("title", topic_slug)
            content_overview = t.get("contentOverview")
            break

    from api.services.prompt_service import load_prompt

    slide_prompt = load_prompt("role/slide-agent")
    if not slide_prompt:
        raise ValueError("Slide prompt not configured")

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

    prompt = slide_prompt.replace("{topic_title}", topic_title)

    user_message = f"Generate a presentation about {topic_title}"
    if context_str:
        user_message += f"\n\n{context_str}"

    messages = [
        {"role": "system", "content": prompt},
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

    slide_content = response["content"]

    slide_content = slide_content.strip()
    if slide_content.startswith("```markdown"):
        slide_content = slide_content[len("```markdown") :]
    elif slide_content.startswith("```"):
        slide_content = slide_content[len("```") :]

    if slide_content.endswith("```"):
        slide_content = slide_content[:-3]

    slide_content = slide_content.strip()

    topic_path = _ensure_topic_folder(space_slug, topic_slug)
    slide_file = os.path.join(topic_path, "slide.md")

    with open(slide_file, "w") as f:
        f.write(slide_content)

    _update_topic_content_flag(space_slug, topic_slug, "slide", True)

    return slide_content


_slidev_servers: dict = {}
_slidev_port_counter = 5100


def get_slidev_url(space_slug: str, topic_slug: str) -> tuple[str, int]:
    import subprocess
    import time
    import shutil
    import os
    import threading
    import http.server
    import socketserver

    logger.debug(f"[Slidev] Starting for {space_slug}/{topic_slug}")

    topic_path = _get_topic_path(space_slug, topic_slug)
    slide_file = os.path.join(topic_path, "slide.md")

    logger.debug(f"[Slidev] Topic path: {topic_path}")
    logger.debug(f"[Slidev] Slide file: {slide_file}")

    if not os.path.exists(slide_file):
        logger.error(f"[Slidev] Slide markdown file not found: {slide_file}")
        raise ValueError("Slide markdown file not found")

    global _slidev_port_counter
    port = _slidev_port_counter
    _slidev_port_counter += 1
    logger.debug(f"[Slidev] Using port: {port}")

    project_dir = f"/tmp/slidev_{space_slug}_{topic_slug}"
    dist_dir = os.path.join(project_dir, "dist")

    if os.path.exists(project_dir):
        shutil.rmtree(project_dir)
    os.makedirs(project_dir, exist_ok=True)
    logger.debug(f"[Slidev] Project dir: {project_dir}")

    with open(slide_file, "r") as f:
        slide_content = f.read()

    tmp_slide_file = os.path.join(project_dir, "slides.md")
    with open(tmp_slide_file, "w") as f:
        f.write(slide_content)
    logger.debug(f"[Slidev] Copied and preprocessed slide file to {tmp_slide_file}")

    config_file = os.path.join(project_dir, "slidev.config.ts")
    with open(config_file, "w") as f:
        f.write("""
import { defineConfig } from '@slidev/cli'

export default defineConfig({
  codeInline: 'edge',
  mermaid: {
    theme: 'default',
  },
})
""")
    logger.debug(f"[Slidev] Created slidev config at {config_file}")

    logger.debug(f"[Slidev] Building static slides...")
    result = subprocess.run(
        ["slidev", "build", "slides.md", "--out", dist_dir],
        capture_output=True,
        text=True,
        cwd=project_dir,
        timeout=180,
    )

    logger.debug(f"[Slidev] Build stdout: {result.stdout[:500]}")
    logger.debug(f"[Slidev] Build stderr: {result.stderr[:500]}")

    if result.returncode != 0:
        logger.error(f"[Slidev] Build failed with code: {result.returncode}")
        raise ValueError(f"Failed to build slides: {result.stderr[:500]}")

    if not os.path.exists(dist_dir):
        logger.error(f"[Slidev] Build output not found: {dist_dir}")
        raise ValueError("Slidev build did not produce output")

    logger.debug(f"[Slidev] Starting HTTP server on port {port}...")

    class QuietHandler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, format, *args):
            pass

        def log_error(self, format, *args):
            pass

    os.chdir(dist_dir)
    httpd = socketserver.TCPServer(("", port), QuietHandler)
    httpd.allow_reuse_address = True

    server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    server_thread.start()

    time.sleep(0.5)

    try:
        resp = requests.get(f"http://localhost:{port}", timeout=5)
        if resp.status_code == 200:
            logger.debug(f"[Slidev] HTTP server ready on port {port}")
    except Exception as e:
        logger.debug(f"[Slidev] Initial check: {e}")

    logger.debug(f"[Slidev] Server started successfully on port {port}")

    return f"http://localhost:{port}", port


def get_topic_slide_server(space_slug: str, topic_slug: str) -> str:
    url, port = get_slidev_url(space_slug, topic_slug)
    return url


def get_topic_slide(space_slug: str, topic_slug: str) -> str:
    topic_path = _get_topic_path(space_slug, topic_slug)
    slide_file = os.path.join(topic_path, "slide.md")

    if not os.path.exists(slide_file):
        return ""

    with open(slide_file, "r") as f:
        return f.read()


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
