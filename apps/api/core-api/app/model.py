from langchain_core.pydantic_v1 import BaseModel, Field
from typing import Optional

class Topic(BaseModel):
    items: list[str] = Field(description="list of learning topic in str")
