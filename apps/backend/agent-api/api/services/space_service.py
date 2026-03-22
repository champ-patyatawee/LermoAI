import os
import re
import json
import uuid
from pathlib import Path
from typing import Optional, Union
from datetime import datetime

from api.schemas.space import (
    SpaceCreate,
    SpaceUpdate,
    Space,
    SpaceWithTopics,
    TopicCreate,
    Topic,
    TopicContent,
    ContentOverview,
)

STORAGE_PATH = os.environ.get("STORAGE_PATH", "./storage") + "/spaces"


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = text.replace(" ", "-").replace("_", "-")
    text = re.sub(r"-+", "-", text)
    text = text.strip("-")
    return text


def get_random_icon() -> str:
    icons = ["📚", "🚀", "💻", "🔒", "🎯", "📁", "⚙️", "🌐"]
    return icons[uuid.uuid4().int % len(icons)]


def get_random_gradient() -> str:
    gradients = [
        "linear-gradient(135deg, #F7685B, #ff9a8b)",
        "linear-gradient(135deg, #6ba3d4, #9ac0e2)",
        "linear-gradient(135deg, #6cc495, #96d4b0)",
        "linear-gradient(135deg, #f0a850, #f4be7a)",
        "linear-gradient(135deg, #e88fa0, #f0b0bc)",
    ]
    return gradients[uuid.uuid4().int % len(gradients)]


def ensure_storage_path() -> Path:
    path = Path(STORAGE_PATH)
    path.mkdir(parents=True, exist_ok=True)
    return path


def read_space_file(space_dir: Path) -> Optional[dict]:
    space_file = space_dir / "space.json"
    if space_file.exists():
        with open(space_file, "r") as f:
            return json.load(f)
    return None


def write_space_file(space_dir: Path, data: dict) -> None:
    space_file = space_dir / "space.json"
    with open(space_file, "w") as f:
        json.dump(data, f, indent=2)


def list_spaces(limit: int = 12, offset: int = 0) -> dict:
    from api.schemas.space import Space, PaginatedSpaces

    storage_path = ensure_storage_path()
    spaces = []

    for item in storage_path.iterdir():
        if item.is_dir():
            space_data = read_space_file(item)
            if space_data:
                spaces.append(
                    Space(
                        id=space_data["id"],
                        title=space_data["title"],
                        slug=space_data["slug"],
                        description=space_data.get("description", ""),
                        icon=space_data["icon"],
                        gradient=space_data["gradient"],
                        created_at=space_data["created_at"],
                    )
                )

    spaces.sort(key=lambda x: x.created_at, reverse=True)

    total = len(spaces)
    paginated = spaces[offset : offset + limit]

    return {"spaces": paginated, "total": total, "limit": limit, "offset": offset}


def get_space(slug: str) -> Optional[SpaceWithTopics]:
    storage_path = ensure_storage_path()
    space_dir = storage_path / slug

    if not space_dir.exists():
        return None

    space_data = read_space_file(space_dir)
    if not space_data:
        return None

    topics = []
    for t in space_data.get("topics", []):
        content_overview = None
        if t.get("contentOverview"):
            content_overview = ContentOverview(**t["contentOverview"])

        topics.append(
            Topic(
                id=t["id"],
                title=t["title"],
                slug=t["slug"],
                order=t["order"],
                contents=TopicContent(**t["contents"]),
                contentOverview=content_overview,
                contentType=t.get("contentType"),
            )
        )

    return SpaceWithTopics(
        id=space_data["id"],
        title=space_data["title"],
        slug=space_data["slug"],
        description=space_data.get("description", ""),
        icon=space_data["icon"],
        gradient=space_data["gradient"],
        created_at=space_data["created_at"],
        topics=topics,
    )


def create_space(data: SpaceCreate) -> Space:
    storage_path = ensure_storage_path()
    slug = slugify(data.title)

    existing = storage_path / slug
    if existing.exists():
        raise ValueError(f"Space with title '{data.title}' already exists")

    space_dir = storage_path / slug
    space_dir.mkdir(parents=True, exist_ok=True)

    space_id = str(uuid.uuid4())
    now = datetime.now().isoformat()

    space_data = {
        "id": space_id,
        "title": data.title,
        "slug": slug,
        "description": data.description or "",
        "icon": get_random_icon(),
        "gradient": get_random_gradient(),
        "created_at": now,
        "topics": [],
    }

    write_space_file(space_dir, space_data)

    return Space(
        id=space_id,
        title=data.title,
        slug=slug,
        description=data.description or "",
        icon=space_data["icon"],
        gradient=space_data["gradient"],
        created_at=now,
    )


def update_space(slug: str, data: SpaceUpdate) -> Optional[SpaceWithTopics]:
    storage_path = ensure_storage_path()
    space_dir = storage_path / slug

    if not space_dir.exists():
        return None

    space_data = read_space_file(space_dir)
    if not space_data:
        return None

    if data.title is not None:
        space_data["title"] = data.title
    if data.description is not None:
        space_data["description"] = data.description

    write_space_file(space_dir, space_data)
    return get_space(slug)


def delete_space(slug: str) -> bool:
    storage_path = ensure_storage_path()
    space_dir = storage_path / slug

    if not space_dir.exists():
        return False

    import shutil

    shutil.rmtree(space_dir)
    return True


def create_topic(space_slug: str, data: TopicCreate) -> Optional[Topic]:
    storage_path = ensure_storage_path()
    space_dir = storage_path / space_slug

    if not space_dir.exists():
        return None

    space_data = read_space_file(space_dir)
    if not space_data:
        return None

    topic_id = str(uuid.uuid4())
    slug = slugify(data.title)

    contents = {
        "article": False,
        "slide": False,
        "flashcard": False,
        "quiz": False,
    }
    if data.content_type == "article":
        contents["article"] = True
    elif data.content_type == "slide":
        contents["slide"] = True
    elif data.content_type == "flashcard":
        contents["flashcard"] = True
    elif data.content_type == "quiz":
        contents["quiz"] = True

    new_topic = {
        "id": topic_id,
        "title": data.title,
        "slug": slug,
        "order": len(space_data.get("topics", [])) + 1,
        "contents": contents,
        "contentOverview": None,
        "contentType": data.content_type,
    }

    if "topics" not in space_data:
        space_data["topics"] = []

    space_data["topics"].append(new_topic)
    write_space_file(space_dir, space_data)

    topic_dir = storage_path / space_slug / "topics" / slug
    topic_dir.mkdir(parents=True, exist_ok=True)

    from api.services.topic_service import create_chat

    create_chat(space_slug, slug)

    return Topic(
        id=topic_id,
        title=data.title,
        slug=slug,
        order=new_topic["order"],
        contents=TopicContent(**new_topic["contents"]),
        contentType=data.content_type,
    )


def create_space_with_topics(
    title: str, description: str, topics: list[Union[str, dict]]
) -> SpaceWithTopics:
    storage_path = ensure_storage_path()
    slug = slugify(title)

    existing = storage_path / slug
    if existing.exists():
        raise ValueError(f"Space with title '{title}' already exists")

    space_dir = storage_path / slug
    space_dir.mkdir(parents=True, exist_ok=True)

    space_id = str(uuid.uuid4())
    now = datetime.now().isoformat()

    topics_data = []
    for i, topic in enumerate(topics):
        if isinstance(topic, str):
            topic_title = topic
            content_overview = None
            content_type = "article"
        else:
            topic_title = topic.get("title", str(topic))
            content_overview = topic.get("contentOverview")
            content_type = topic.get("contentType", "article")

        contents = {
            "article": content_type == "article",
            "slide": content_type == "slide",
            "flashcard": content_type == "flashcard",
            "quiz": content_type == "quiz",
        }

        topics_data.append(
            {
                "id": str(uuid.uuid4()),
                "title": topic_title,
                "slug": slugify(topic_title),
                "order": i + 1,
                "contents": contents,
                "contentOverview": content_overview,
                "contentType": content_type,
            }
        )

    space_data = {
        "id": space_id,
        "title": title,
        "slug": slug,
        "description": description or "",
        "icon": get_random_icon(),
        "gradient": get_random_gradient(),
        "created_at": now,
        "topics": topics_data,
    }

    write_space_file(space_dir, space_data)

    return get_space(slug)
