from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, Dict, Any
from datetime import datetime


class AIConfigBase(BaseModel):
    provider: str = "openai"
    base_url: HttpUrl = "https://api.openai.com/v1"
    api_key: str
    model: str = "gpt-4o"


class AIConfigCreate(AIConfigBase):
    pass


class AIConfigResponse(AIConfigBase):
    api_key: str = Field(..., description="API key (masked in responses)")


class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)


class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BrandBase(BaseModel):
    business_name: Optional[str] = Field(None, max_length=255)
    segment: Optional[str] = Field(None, max_length=100)
    tone_of_voice: Optional[str] = Field(None, max_length=50)
    palette: Optional[Dict[str, Any]] = None
    typography: Optional[Dict[str, Any]] = None
    logo_svg: Optional[str] = None


class BrandCreate(BrandBase):
    project_id: int


class BrandUpdate(BaseModel):
    business_name: Optional[str] = Field(None, max_length=255)
    segment: Optional[str] = Field(None, max_length=100)
    tone_of_voice: Optional[str] = Field(None, max_length=50)
    palette: Optional[Dict[str, Any]] = None
    typography: Optional[Dict[str, Any]] = None
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
    brand_id: int


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
    project_id: int
    business_name: str
    segment: Optional[str] = None
    tone_of_voice: Optional[str] = None


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
    design_system_id: int


class ExportTokensResponse(BaseModel):
    json: Dict[str, Any]
    css_variables: str
    tailwind_config: str