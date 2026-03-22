import os
from pathlib import Path
from typing import Optional

STORAGE_PATH = os.environ.get("AGENT_STORAGE_PATH", "./storage/agent")


def _get_base_path() -> Path:
    """Get base path for agent files"""
    return Path(STORAGE_PATH)


def get_prompt_path(prompt_type: str) -> Path:
    """Get the file path for a prompt type"""
    base_path = _get_base_path()
    return base_path / f"{prompt_type}.md"


def load_prompt(prompt_type: str) -> str:
    """Load prompt from file with auto-concatenated skill if available"""
    prompt_file = get_prompt_path(prompt_type)

    if prompt_file.exists():
        with open(prompt_file, "r", encoding="utf-8") as f:
            role_prompt = f.read()
    else:
        return ""

    skill_type = prompt_type.replace("role/", "")
    skill = load_skill(skill_type)

    if skill:
        return role_prompt + "\n\n" + skill

    return role_prompt


def load_skill(skill_type: str) -> str:
    """Load skill guide from file"""
    skill_file = _get_base_path() / "skill" / f"{skill_type}.md"

    if skill_file.exists():
        with open(skill_file, "r", encoding="utf-8") as f:
            return f.read()

    return ""


def prompt_exists(prompt_type: str) -> bool:
    """Check if a prompt file exists"""
    return get_prompt_path(prompt_type).exists()


def skill_exists(skill_type: str) -> bool:
    """Check if a skill file exists"""
    skill_file = _get_base_path() / "skill" / f"{skill_type}.md"
    return skill_file.exists()
