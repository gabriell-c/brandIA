"""
AI Configuration Routes - BYOK (Bring Your Own Key) endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import json
import os
from typing import Dict, Any
from cryptography.fernet import Fernet
from app.database import get_db
from app.models import Brand, AIConfig, DesignSystem
from app.schemas import (
    AIConfigBase, AIConfigCreate, AIConfigResponse,
    BrandGenerateRequest, BrandGenerateResponse,
    PaletteValidateRequest, PaletteValidateResponse,
    ExportTokensRequest, ExportTokensResponse
)
from app.agents.brand_agent import BrandAgent
from app.agents.palette_agent import PaletteAgent
from app.agents.typography_agent import TypographyAgent

router = APIRouter()

# Encryption key for storing API keys securely
# In production, this should come from environment variable
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY", Fernet.generate_key().decode())
if isinstance(ENCRYPTION_KEY, str):
    ENCRYPTION_KEY = ENCRYPTION_KEY.encode()
fernet = Fernet(ENCRYPTION_KEY)


def encrypt_key(key: str) -> str:
    """Encrypt API key before storing"""
    return fernet.encrypt(key.encode()).decode()


def decrypt_key(encrypted_key: str) -> str:
    """Decrypt API key when retrieving"""
    return fernet.decrypt(encrypted_key.encode()).decode()


@router.post("/config", response_model=AIConfigResponse)
async def set_ai_config(config: AIConfigCreate, db: AsyncSession = Depends(get_db)):
    """Configure AI provider (BYOK) with encrypted key storage"""
    # Encrypt the API key before storing
    encrypted_key = encrypt_key(config.api_key)
    
    # Save or update config
    result = await db.execute(select(AIConfig).limit(1))
    ai_config = result.scalar_one_or_none()
    
    if ai_config:
        ai_config.provider = config.provider
        ai_config.base_url = str(config.base_url)
        ai_config.api_key = encrypted_key
        ai_config.model = config.model
    else:
        ai_config = AIConfig(
            provider=config.provider,
            base_url=str(config.base_url),
            api_key=encrypted_key,
            model=config.model
        )
        db.add(ai_config)
    
    await db.commit()
    await db.refresh(ai_config)
    
    # Return response with masked key
    return AIConfigResponse(
        provider=ai_config.provider,
        base_url=ai_config.base_url,
        api_key="***",
        model=ai_config.model
    )


@router.get("/config", response_model=AIConfigResponse)
async def get_ai_config(db: AsyncSession = Depends(get_db)):
    """Get current AI config (with masked key)"""
    result = await db.execute(select(AIConfig).limit(1))
    ai_config = result.scalar_one_or_none()
    
    if not ai_config:
        return AIConfigResponse(
            provider="openai",
            base_url="https://api.openai.com/v1",
            api_key="",
            model="gpt-4o"
        )
    
    return AIConfigResponse(
        provider=ai_config.provider,
        base_url=ai_config.base_url,
        api_key="***",
        model=ai_config.model
    )


@router.delete("/config")
async def delete_ai_config(db: AsyncSession = Depends(get_db)):
    """Remove AI configuration"""
    result = await db.execute(select(AIConfig).limit(1))
    ai_config = result.scalar_one_or_none()
    
    if ai_config:
        await db.delete(ai_config)
        await db.commit()
        return {"message": "AI configuration removed"}
    
    return {"message": "No configuration to remove"}


async def get_ai_config_dependency(db: AsyncSession = Depends(get_db)) -> AIConfigBase:
    """Dependency to get AI config with decrypted key"""
    result = await db.execute(select(AIConfig).limit(1))
    ai_config = result.scalar_one_or_none()
    
    if not ai_config:
        raise HTTPException(
            status_code=400, 
            detail="AI not configured. Call POST /api/v1/ai-config/config first."
        )
    
    decrypted_key = decrypt_key(ai_config.api_key)
    
    return AIConfigBase(
        provider=ai_config.provider,
        base_url=ai_config.base_url,
        api_key=decrypted_key,
        model=ai_config.model
    )


@router.post("/brand/generate", response_model=BrandGenerateResponse)
async def generate_brand(
    request: BrandGenerateRequest,
    db: AsyncSession = Depends(get_db),
    ai_config: AIConfigBase = Depends(get_ai_config_dependency)
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
    ai_config: AIConfigBase = Depends(get_ai_config_dependency)
):
    """Validate palette against WCAG and color theory"""
    palette_agent = PaletteAgent(ai_config)
    result = await palette_agent.validate(request.palette)
    return PaletteValidateResponse(
        colors=result.get("colors", []),
        accessibility=result.get("accessibility", {})
    )


@router.post("/export-tokens", response_model=ExportTokensResponse)
async def export_tokens(
    request: ExportTokensRequest,
    db: AsyncSession = Depends(get_db)
):
    """Export design tokens in multiple formats"""
    result = await db.execute(select(DesignSystem).where(DesignSystem.id == request.design_system_id))
    ds = result.scalar_one_or_none()
    
    if not ds:
        raise HTTPException(status_code=404, detail="Design system not found")
    
    # Parse tokens
    import json
    tokens = json.loads(ds.tokens) if ds.tokens else {}
    components = json.loads(ds.components) if ds.components else {}
    
    # Generate CSS Variables
    css_vars = ":root {\n"
    for key, value in tokens.items():
        css_vars += f"  --{key}: {value};\n"
    css_vars += "}\n"
    
    # Generate Tailwind Config
    tailwind_config = """// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
"""
    for key, value in tokens.items():
        tailwind_config += f"        '{key}': '{value}',\n"
    tailwind_config += """      },
    },
  },
}
"""
    
    return ExportTokensResponse(
        json=tokens,
        css_variables=css_vars,
        tailwind_config=tailwind_config
    )
