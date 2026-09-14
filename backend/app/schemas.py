"""
OmniRoute Design System - Pydantic Schemas
"""
from pydantic import BaseModel, Field, HttpUrl, field_validator
from typing import Optional, Dict, Any
from datetime import datetime
import re


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
    description: Optional[str] = Field(None, max_length=1000)
    business_name: Optional[str] = Field(None, max_length=255)
    business_segment: Optional[str] = Field(None, max_length=100)


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    business_name: Optional[str] = Field(None, max_length=255)
    business_segment: Optional[str] = Field(None, max_length=100)

    @field_validator('name')
    @classmethod
    def validate_name(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not re.match(r'^[a-zA-Z0-9\s\-_.]+$', v):
            raise ValueError('Nome deve conter apenas letras, números, espaços, hífen, underline ou ponto')
        return v


class ProjectResponse(ProjectBase):
    id: int
    description: Optional[str] = None
    business_name: Optional[str] = None
    business_segment: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BrandBase(BaseModel):
    business_name: Optional[str] = Field(None, max_length=255)
    segment: Optional[str] = Field(None, max_length=100)
    tone_of_voice: Optional[str] = Field(None, max_length=50)
    palette: Optional[Dict[str, str]] = None
    typography: Optional[Dict[str, str]] = None
    logo_svg: Optional[str] = None


class BrandCreate(BrandBase):
    project_id: int = Field(..., gt=0)


class BrandUpdate(BaseModel):
    business_name: Optional[str] = Field(None, max_length=255)
    segment: Optional[str] = Field(None, max_length=100)
    tone_of_voice: Optional[str] = Field(None, max_length=50)
    palette: Optional[Dict[str, str]] = None
    typography: Optional[Dict[str, str]] = None
    logo_svg: Optional[str] = None


class BrandResponse(BrandBase):
    id: int
    project_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class DesignSystemBase(BaseModel):
    tokens: Optional[Dict[str, Any]] = None
    components: Optional[Dict[str, Any]] = None


class DesignSystemCreate(DesignSystemBase):
    brand_id: int = Field(..., gt=0)


class DesignSystemUpdate(BaseModel):
    tokens: Optional[Dict[str, Any]] = None
    components: Optional[Dict[str, Any]] = None


class DesignSystemResponse(DesignSystemBase):
    id: int
    brand_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# IA Schemas
class BrandGenerateRequest(BaseModel):
    project_id: int = Field(..., gt=0)
    business_name: str = Field(..., min_length=1, max_length=255)
    segment: Optional[str] = Field(None, max_length=100)
    tone_of_voice: Optional[str] = Field(None, max_length=50)


class BrandGenerateResponse(BaseModel):
    brand_name: str
    tagline: Optional[str] = None
    palette: Dict[str, str]
    typography: Dict[str, str]
    explanation: str


class PaletteValidateRequest(BaseModel):
    palette: Dict[str, str]


class PaletteValidateResponse(BaseModel):
    colors: list
    accessibility: Dict[str, bool]


class ExportTokensRequest(BaseModel):
    design_system_id: int = Field(..., gt=0)


class ExportTokensResponse(BaseModel):
    json: Dict[str, Any]
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
    colors: Dict[str, str] = Field(..., min_length=6)
    description: Optional[str] = Field(None, max_length=500)
    author: Optional[str] = Field(None, max_length=100)
    category: Optional[str] = Field("uncategorized", max_length=50)
    tags: Optional[List[str]] = Field(default_factory=list)


class PaletteResponse(BaseModel):
    id: int
    name: str
    colors: Dict[str, str]
    description: Optional[str] = None
    author: Optional[str] = None
    category: str
    tags: List[str]
    rating: float
    votes: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class FontPairingCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    heading_font: str = Field(..., min_length=1, max_length=100)
    body_font: str = Field(..., min_length=1, max_length=100)
    mono_font: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    author: Optional[str] = Field(None, max_length=100)
    style: Optional[str] = Field("modern", max_length=50)
    tags: Optional[List[str]] = Field(default_factory=list)


class FontPairingResponse(BaseModel):
    id: int
    name: str
    heading_font: str
    body_font: str
    mono_font: str
    description: Optional[str] = None
    author: Optional[str] = None
    style: str
    tags: List[str]
    rating: float
    votes: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TemplateResponse(BaseModel):
    id: int
    name: str
    description: str
    segment: str
    palette: Dict[str, str]
    typography: Dict[str, str]
    preview_image: Optional[str] = None
    author: str
    is_premium: bool
    tags: List[str]
    created_at: datetime

    class Config:
        from_attributes = True
