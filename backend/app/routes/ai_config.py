"""
AI Configuration Routes - BYOK (Bring Your Own Key) endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import json
import os
from typing import Dict, Any, List
from cryptography.fernet import Fernet
from app.database import get_db
from app.models import Brand, AIConfig, DesignSystem
from app.schemas import (
    AIConfigBase, AIConfigCreate, AIConfigResponse,
    BrandGenerateRequest, BrandGenerateResponse,
    PaletteValidateRequest, PaletteValidateResponse,
    ExportTokensRequest, ExportTokensResponse,
    RAGSearchRequest, RAGSearchResponse
)
from app.agents import BrandingAgent, PaletteAgent, TypographyAgent
from app.ai_client import AIConfig as AIClientConfig
from app.rules.rag import get_rag

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


def get_ai_client_config(ai_config_base: AIConfigBase) -> AIClientConfig:
    """Convert AIConfigBase to AIClientConfig for the agents."""
    return AIClientConfig(
        provider=ai_config_base.provider,
        base_url=str(ai_config_base.base_url),
        api_key=ai_config_base.api_key,
        model=ai_config_base.model,
        timeout=30,
        max_retries=3
    )


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
    """Generate branding using AI agents with RAG context"""
    # Get RAG context if available
    rag = get_rag()
    rag_context = rag.get_context(
        f"branding {request.business_name} {request.segment or ''} {request.tone_of_voice or ''}"
    )
    
    # Initialize agents
    agent_config = get_ai_client_config(ai_config)
    branding_agent = BrandingAgent(agent_config, rag_context=rag_context)
    palette_agent = PaletteAgent(agent_config, rag_context=rag_context)
    typography_agent = TypographyAgent(agent_config, rag_context=rag_context)
    
    # Generate branding
    business_info = {
        "business_name": request.business_name,
        "segment": request.segment,
        "tone_of_voice": request.tone_of_voice
    }
    
    # Step 1: Brand agent generates overall concept
    brand_result = await branding_agent.generate(business_info)
    
    # Step 2: Palette agent generates color palette
    palette_result = await palette_agent.generate(business_info)
    
    # Step 3: Typography agent generates typography
    typography_result = await typography_agent.generate(business_info)
    
    # Combine results
    response = BrandGenerateResponse(
        brand_name=brand_result.brand_name,
        tagline=brand_result.tagline,
        palette=palette_result.palette,
        typography={
            "heading": typography_result.heading,
            "body": typography_result.body,
            "mono": typography_result.mono
        },
        explanation=f"{brand_result.explanation}\n\n{typography_result.explanation}"
    )
    
    return response


@router.post("/brand/validate", response_model=PaletteValidateResponse)
async def validate_palette(
    request: PaletteValidateRequest,
    ai_config: AIConfigBase = Depends(get_ai_config_dependency)
):
    """Validate palette against WCAG and color theory"""
    agent_config = get_ai_client_config(ai_config)
    palette_agent = PaletteAgent(agent_config)
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
    tokens = json.loads(ds.tokens) if ds.tokens else {}
    
    # Generate CSS Variables
    css_vars = ":root {\n"
    for key, value in tokens.items():
        css_vars += f"  --{key}: {value};\n"
    css_vars += "}"
    
    # Generate Tailwind Config
    tailwind_config = """// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n"""
    for key, value in tokens.items():
        tailwind_config += f"        '{key}': '{value}',\n"
    tailwind_config += """      },\n    },\n  },\n}"""
    
    return ExportTokensResponse(
        json=tokens,
        css_variables=css_vars,
        tailwind_config=tailwind_config
    )


@router.get("/rules")
async def list_rules():
    """List all available rules"""
    rag = get_rag()
    return {"rules": rag.get_all_rules()}


@router.post("/search", response_model=RAGSearchResponse)
async def search_rules(request: RAGSearchRequest):
    """Search rules using RAG"""
    rag = get_rag()
    results = rag.search(request.query, top_k=3)
    
    return RAGSearchResponse(
        query=request.query,
        results=[{
            "name": r.name,
            "relevance_score": r.get_relevance_score(request.query),
            "content_preview": r.content[:200] + "..." if len(r.content) > 200 else r.content
        } for r in results]
    )