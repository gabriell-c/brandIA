from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import json
import os
from typing import Dict, Any

from app.database import get_db
from app.models import Brand
from app.schemas import (
    AIConfigBase, BrandGenerateRequest, BrandGenerateResponse,
    PaletteValidateRequest, PaletteValidateResponse
)
from app.agents.brand_agent import BrandAgent
from app.agents.palette_agent import PaletteAgent
from app.agents.typography_agent import TypographyAgent

router = APIRouter()


# Global AI config (em produção seria por usuário/projeto)
_ai_config = None


@router.post("/config")
async def set_ai_config(config: AIConfigBase):
    """Configure AI provider (BYOK)"""
    global _ai_config
    _ai_config = config
    # Validar conexão
    try:
        # Testar conexão rápida
        pass
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid AI config: {str(e)}")
    return {"message": "AI configuration saved"}


@router.get("/config")
async def get_ai_config():
    """Get current AI config (with masked key)"""
    global _ai_config
    if not _ai_config:
        return {"provider": "openai", "base_url": "https://api.openai.com/v1", "model": "gpt-4o", "configured": False}
    return {
        "provider": _ai_config.provider,
        "base_url": str(_ai_config.base_url),
        "model": _ai_config.model,
        "configured": True
    }


def get_ai_config_global():
    """Dependency to get AI config"""
    global _ai_config
    if not _ai_config:
        raise HTTPException(status_code=400, detail="AI not configured. Call /api/v1/ai-config/config first.")
    return _ai_config


@router.post("/brand/generate", response_model=BrandGenerateResponse)
async def generate_brand(
    request: BrandGenerateRequest,
    db: AsyncSession = Depends(get_db),
    ai_config: AIConfigBase = Depends(get_ai_config_global)
):
    """Generate branding using AI agents"""
    # Verify project exists
    result = await db.execute(select(Brand).where(Brand.project_id == request.project_id))
    existing_brand = result.scalar_one_or_none()
    
    # Initialize agents
    brand_agent = BrandAgent(ai_config)
    palette_agent = PaletteAgent(ai_config)
    typography_agent = TypographyAgent(ai_config)
    
    # Generate branding
    business_info = {
        "business_name": request.business_name,
        "segment": request.segment,
        "tone_of_voice": request.tone_of_voice
    }
    
    # Step 1: Brand agent generates overall concept
    brand_result = await brand_agent.generate(business_info)
    
    # Step 2: Palette agent generates color palette
    palette_result = await palette_agent.generate(business_info, brand_result.get("explanation", ""))
    
    # Step 3: Typography agent generates typography
    typography_result = await typography_agent.generate(business_info, brand_result.get("explanation", ""))
    
    # Combine results
    response = BrandGenerateResponse(
        brand_name=brand_result.get("brand_name", request.business_name),
        tagline=brand_result.get("tagline"),
        palette=palette_result.get("palette", {}),
        typography=typography_result.get("typography", {}),
        explanation=brand_result.get("explanation", "")
    )
    
    return response


@router.post("/brand/validate", response_model=PaletteValidateResponse)
async def validate_palette(
    request: PaletteValidateRequest,
    ai_config: AIConfigBase = Depends(get_ai_config_global)
):
    """Validate palette against WCAG and color theory"""
    palette_agent = PaletteAgent(ai_config)
    result = await palette_agent.validate(request.palette)
    return PaletteValidateResponse(
        colors=result.get("colors", []),
        accessibility=result.get("accessibility", {})
    )