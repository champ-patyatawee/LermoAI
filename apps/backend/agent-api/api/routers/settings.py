from typing import Union

from fastapi import APIRouter, HTTPException

from api.schemas.settings import Settings, ProviderSettings, CustomProviderSettings
from api.services import settings_service

router = APIRouter(prefix="/api/settings", tags=["settings"])


@router.get("", response_model=Settings)
def get_settings():
    return settings_service.load_settings()


@router.put("/providers/{provider}", response_model=Settings)
def update_provider_settings(
    provider: str, data: Union[ProviderSettings, CustomProviderSettings]
):
    if provider not in ["openrouter", "custom"]:
        raise HTTPException(status_code=400, detail="Invalid provider")
    return settings_service.update_provider_settings(provider, data)
