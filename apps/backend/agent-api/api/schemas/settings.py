from typing import Optional
from pydantic import BaseModel


class ProviderSettings(BaseModel):
    enabled: bool = False
    apiKey: str = ""
    model: str = ""


class CustomProviderSettings(BaseModel):
    enabled: bool = False
    url: str = ""
    apiKey: str = ""
    model: str = ""


class Settings(BaseModel):
    openrouter: Optional[ProviderSettings] = None
    custom: Optional[CustomProviderSettings] = None
