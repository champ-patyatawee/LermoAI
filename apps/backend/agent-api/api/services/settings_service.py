import os
import json
from pathlib import Path
from typing import Optional, Union

from api.schemas.settings import Settings, ProviderSettings, CustomProviderSettings

STORAGE_PATH = os.environ.get("STORAGE_PATH", "./storage")
SETTINGS_FILE = "settings.json"


def get_settings_path() -> Path:
    path = Path(STORAGE_PATH)
    path.mkdir(parents=True, exist_ok=True)
    return path / SETTINGS_FILE


def load_settings() -> Settings:
    settings_file = get_settings_path()
    if settings_file.exists():
        try:
            with open(settings_file, "r") as f:
                data = json.load(f)
                if data:
                    settings = Settings(**data)
                    return settings
        except (json.JSONDecodeError, ValueError):
            pass

    settings = Settings()
    save_settings(settings)
    return settings


def save_settings(settings: Settings) -> Settings:
    settings_file = get_settings_path()
    with open(settings_file, "w") as f:
        json.dump(settings.dict(exclude_none=True), f, indent=2)
    return settings


def update_provider_settings(
    provider: str, data: Union[ProviderSettings, CustomProviderSettings]
) -> Settings:
    settings = load_settings()
    settings_model = settings.dict()
    settings_model[provider] = data.dict()
    settings = Settings(**settings_model)
    return save_settings(settings)
