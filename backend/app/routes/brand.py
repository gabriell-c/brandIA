from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import json
from typing import Dict, Any

from app.database import get_db
from app.models import Brand, Project
from app.schemas import BrandCreate, BrandUpdate, BrandResponse

router = APIRouter()


@router.post("/", response_model=BrandResponse)
async def create_brand(brand_data: BrandCreate, db: AsyncSession = Depends(get_db)):
    """Create a new brand for a project"""
    # Verify project exists
    result = await db.execute(select(Project).where(Project.id == brand_data.project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    brand = Brand(
        project_id=brand_data.project_id,
        business_name=brand_data.business_name,
        segment=brand_data.segment,
        tone_of_voice=brand_data.tone_of_voice,
        palette=json.dumps(brand_data.palette) if brand_data.palette else None,
        typography=json.dumps(brand_data.typography) if brand_data.typography else None,
        logo_svg=brand_data.logo_svg
    )
    db.add(brand)
    await db.commit()
    await db.refresh(brand)
    return brand


@router.put("/{brand_id}", response_model=BrandResponse)
async def update_brand(brand_id: int, brand_data: BrandUpdate, db: AsyncSession = Depends(get_db)):
    """Update an existing brand"""
    result = await db.execute(select(Brand).where(Brand.id == brand_id))
    brand = result.scalar_one_or_none()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    if brand_data.business_name is not None:
        brand.business_name = brand_data.business_name
    if brand_data.segment is not None:
        brand.segment = brand_data.segment
    if brand_data.tone_of_voice is not None:
        brand.tone_of_voice = brand_data.tone_of_voice
    if brand_data.palette is not None:
        brand.palette = json.dumps(brand_data.palette)
    if brand_data.typography is not None:
        brand.typography = json.dumps(brand_data.typography)
    if brand_data.logo_svg is not None:
        brand.logo_svg = brand_data.logo_svg
    
    await db.commit()
    await db.refresh(brand)
    return brand