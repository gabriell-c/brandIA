"""
Advanced Features Routes - Vectorization, Logo, Templates, Palettes, Fonts
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Dict, Any, List, Optional
import json
import logging

from app.database import get_db
from app.schemas import (
    PaletteCreate, PaletteResponse,
    FontPairingCreate, FontPairingResponse,
    TemplateResponse,
    CommentCreate, CommentResponse
)
from app.services.vectorization import get_vectorization_service
from app.services.typographic_logo import get_typographic_service
from app.services.palette_db import get_palette_db
from app.services.font_db import get_font_db
from app.services.templates import get_template_db

logger = logging.getLogger(__name__)

router = APIRouter()


# Vectorization endpoints
@router.post("/vectorize")
async def vectorize_image(
    file: UploadFile = File(...),
    format: str = "svg"
):
    """Convert PNG/JPG to SVG vector."""
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    image_data = await file.read()
    
    vectorization_service = get_vectorization_service()
    svg_content = await vectorization_service.vectorize(image_data, format)
    
    return {
        "format": format,
        "svg": svg_content,
        "preview": f"data:image/svg+xml;base64,{svg_content}"
    }


# Typographic logo endpoints
@router.post("/logo/typographic")
async def generate_typographic_logo(request: Dict[str, Any]):
    """Generate a typographic logo."""
    text = request.get("text", "Brand")
    font_family = request.get("font", "Inter")
    color = request.get("color", "#111827")
    
    typographic_service = get_typographic_service()
    variations = typographic_service.generate_variations(text, font_family, color)
    
    return {
        "variations": variations,
        "fonts": typographic_service.fonts
    }


# Palette endpoints
@router.get("/palettes")
async def list_palettes(
    category: Optional[str] = None,
    tags: Optional[str] = None,
    search: Optional[str] = None
):
    """List community palettes with filters."""
    palette_db = get_palette_db()
    
    tag_list = tags.split(',') if tags else None
    palettes = palette_db.get_all(category=category, tags=tag_list, search=search)
    
    return [p.to_dict() for p in palettes]


@router.get("/palettes/{palette_id}")
async def get_palette(palette_id: int):
    """Get a specific palette."""
    palette_db = get_palette_db()
    palette = palette_db.get_by_id(palette_id)
    
    if not palette:
        raise HTTPException(status_code=404, detail="Palette not found")
    
    return palette.to_dict()


@router.post("/palettes")
async def create_palette(request: PaletteCreate):
    """Create a new community palette."""
    palette_db = get_palette_db()
    palette = palette_db.create(
        name=request.name,
        colors=request.colors,
        description=request.description or "",
        author=request.author or "Anonymous",
        category=request.category or "uncategorized",
        tags=request.tags or []
    )
    
    return palette.to_dict()


@router.post("/palettes/{palette_id}/vote")
async def vote_palette(palette_id: int, score: int = 5):
    """Vote for a palette."""
    if score < 1 or score > 5:
        raise HTTPException(status_code=400, detail="Score must be between 1 and 5")
    
    palette_db = get_palette_db()
    palette = palette_db.vote(palette_id, score)
    
    if not palette:
        raise HTTPException(status_code=404, detail="Palette not found")
    
    return palette.to_dict()


@router.post("/palettes/{palette_id}/comments", response_model=CommentResponse)
async def create_palette_comment(palette_id: int, request: CommentCreate):
    """Add a comment to a palette."""
    if request.palette_id != palette_id:
        raise HTTPException(status_code=400, detail="Palette ID mismatch")
    
    palette_db = get_palette_db()
    comment = palette_db.create_comment(
        palette_id=palette_id,
        author=request.author,
        content=request.content
    )
    
    if not comment:
        raise HTTPException(status_code=404, detail="Palette not found")
    
    return comment


@router.get("/palettes/{palette_id}/comments", response_model=List[CommentResponse])
async def get_palette_comments(palette_id: int):
    """Get all comments for a palette."""
    palette_db = get_palette_db()
    comments = palette_db.get_comments(palette_id)
    return [c.to_dict() for c in comments]


# Font endpoints
@router.get("/fonts")
async def list_fonts(
    style: Optional[str] = None,
    tags: Optional[str] = None,
    search: Optional[str] = None
):
    """List font pairings with filters."""
    font_db = get_font_db()
    
    tag_list = tags.split(',') if tags else None
    pairings = font_db.get_all(style=style, tags=tag_list, search=search)
    
    return {
        "data": [p.to_dict() for p in pairings],
        "styles": font_db.get_styles(),
        "tags": font_db.get_tags()
    }


@router.get("/fonts/{pairing_id}")
async def get_font_pairing(pairing_id: int):
    """Get a specific font pairing."""
    font_db = get_font_db()
    pairing = font_db.get_by_id(pairing_id)
    
    if not pairing:
        raise HTTPException(status_code=404, detail="Font pairing not found")
    
    return pairing.to_dict()


@router.post("/fonts/{pairing_id}/vote")
async def vote_font(pairing_id: int, score: int = 5):
    """Vote for a font pairing."""
    if score < 1 or score > 5:
        raise HTTPException(status_code=400, detail="Score must be between 1 and 5")
    
    font_db = get_font_db()
    pairing = font_db.vote(pairing_id, score)
    
    if not pairing:
        raise HTTPException(status_code=404, detail="Font pairing not found")
    
    return pairing.to_dict()


# Template endpoints
@router.get("/templates")
async def list_templates(
    segment: Optional[str] = None,
    tags: Optional[str] = None,
    search: Optional[str] = None
):
    """List available templates."""
    template_db = get_template_db()
    
    tag_list = tags.split(',') if tags else None
    templates = template_db.get_all(segment=segment, tags=tag_list, search=search)
    
    return {
        "data": [t.to_dict() for t in templates],
        "segments": template_db.get_segments(),
        "tags": template_db.get_tags()
    }


@router.get("/templates/{template_id}")
async def get_template(template_id: int):
    """Get a specific template."""
    template_db = get_template_db()
    template = template_db.get_by_id(template_id)
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    return template.to_dict()


@router.get("/templates/premium")
async def get_premium_templates():
    """Get premium templates."""
    template_db = get_template_db()
    templates = template_db.get_premium()
    
    return [t.to_dict() for t in templates]