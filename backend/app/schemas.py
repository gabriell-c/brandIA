"""
OmniRoute Design System - Pydantic Schemas
"""
import re
from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, HttpUrl, field_validator


class ErrorResponse(BaseModel):
    detail: str
    type: str
    status_code: int


class AIConfigBase(BaseModel):
    provider: str = Field("openai", pattern="^(openai|anthropic|ollama|custom)$")
    base_url: HttpUrl = Field("https://api.openai.com/v1")
    api_key: str = Field(..., min_length=1, max_length=500)
    model: str = Field("gpt-4o", min_length=1, max_length=100)

    @field_validator('api_key')
    @classmethod
    def mask_api_key(cls, v: str) -> str:
        if len(v) > 8:
            return v[:4] + '***' + v[-4:]
        return '***'


class AIConfigCreate(AIConfigBase):
    pass


class AIConfigResponse(AIConfigBase):
    api_key: str = Field(..., description="API key (masked in responses)")


class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)

    @field_validator('name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        if not re.match(r'^[a-zA-Z0-9\s\-_.]+$', v):
            raise ValueError('Nome deve conter apenas letras, números, espaços, hífen, underline ou ponto')
        return v


class ProjectCreate(ProjectBase):
    description: str = Field(..., max_length=1000)
    business_name: str = Field(..., max_length=255)
    business_segment: str = Field(..., max_length=100)


class ProjectUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = Field(None, max_length=1000)
    business_name: str | None = Field(None, max_length=255)
    business_segment: str | None = Field(None, max_length=100)

    @field_validator('name')
    @classmethod
    def validate_name(cls, v: str | None) -> str | None:
        if v is not None and not re.match(r'^[a-zA-Z0-9\s\-_.]+$', v):
            raise ValueError('Nome deve conter apenas letras, números, espaços, hífen, underline ou ponto')
        return v


class ProjectResponse(ProjectBase):
    id: int
    description: str | None = None
    business_name: str | None = None
    business_segment: str | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BrandBase(BaseModel):
    business_name: str | None = Field(None, max_length=255)
    segment: str | None = Field(None, max_length=100)
    tone_of_voice: str | None = Field(None, max_length=50)
    palette: dict[str, str] | None = None
    typography: dict[str, str] | None = None
    logo_svg: str | None = None


class BrandCreate(BrandBase):
    project_id: int = Field(..., gt=0)


class BrandUpdate(BaseModel):
    business_name: str | None = Field(None, max_length=255)
    segment: str | None = Field(None, max_length=100)
    tone_of_voice: str | None = Field(None, max_length=50)
    palette: dict[str, str] | None = None
    typography: dict[str, str] | None = None
    logo_svg: str | None = None


class BrandResponse(BrandBase):
    id: int
    project_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DesignSystemBase(BaseModel):
    tokens: dict[str, Any] | None = None
    components: dict[str, Any] | None = None


class DesignSystemCreate(DesignSystemBase):
    brand_id: int = Field(..., gt=0)


class DesignSystemUpdate(BaseModel):
    tokens: dict[str, Any] | None = None
    components: dict[str, Any] | None = None


class DesignSystemResponse(DesignSystemBase):
    id: int
    brand_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# IA Schemas
class BrandGenerateRequest(BaseModel):
    project_id: int = Field(..., gt=0)
    business_name: str = Field(..., min_length=1, max_length=255)
    segment: str | None = Field(None, max_length=100)
    tone_of_voice: str | None = Field(None, max_length=50)


class BrandGenerateResponse(BaseModel):
    brand_name: str
    tagline: str | None = None
    palette: dict[str, str]
    typography: dict[str, str]
    explanation: str


class PaletteValidateRequest(BaseModel):
    palette: dict[str, str]


class PaletteValidateResponse(BaseModel):
    colors: list
    accessibility: dict[str, bool]


class ExportTokensRequest(BaseModel):
    design_system_id: int = Field(..., gt=0)


class ExportTokensResponse(BaseModel):
    data: dict[str, Any]
    css_variables: str
    tailwind_config: str


# RAG Schemas
class RAGSearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500)


class RAGSearchResponse(BaseModel):
    query: str
    results: list


# Advanced Features Schemas
class PaletteCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    colors: dict[str, str] = Field(..., min_length=6)
    description: str | None = Field(None, max_length=500)
    author: str | None = Field(None, max_length=100)
    category: str | None = Field("uncategorized", max_length=50)
    tags: list[str] | None = Field(default_factory=list)


class PaletteResponse(BaseModel):
    id: int
    name: str
    colors: dict[str, str]
    description: str | None = None
    author: str | None = None
    category: str
    tags: list[str]
    rating: float
    votes: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CommentCreate(BaseModel):
    palette_id: int = Field(..., gt=0)
    author: str = Field(..., min_length=1, max_length=100)
    content: str = Field(..., min_length=1, max_length=1000)


class CommentResponse(BaseModel):
    id: int
    palette_id: int
    author: str
    content: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class FontPairingCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    heading_font: str = Field(..., min_length=1, max_length=100)
    body_font: str = Field(..., min_length=1, max_length=100)
    mono_font: str = Field(..., min_length=1, max_length=100)
    description: str | None = Field(None, max_length=500)
    author: str | None = Field(None, max_length=100)
    style: str | None = Field("modern", max_length=50)
    tags: list[str] | None = Field(default_factory=list)


class FontPairingResponse(BaseModel):
    id: int
    name: str
    heading_font: str
    body_font: str
    mono_font: str
    description: str | None = None
    author: str | None = None
    style: str
    tags: list[str]
    rating: float
    votes: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TemplateResponse(BaseModel):
    id: int
    name: str
    description: str
    segment: str
    palette: dict[str, str]
    typography: dict[str, str]
    preview_image: str | None = None
    author: str
    is_premium: bool
    tags: list[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
