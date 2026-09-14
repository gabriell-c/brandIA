"""
Brand Routes - CRUD for brands and branding generation
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import json
from typing import Dict, Any, List

from app.database import get_db
from app.models import Brand, Project, DesignSystem
from app.schemas import BrandCreate, BrandUpdate, BrandResponse, DesignSystemCreate, DesignSystemResponse

router = APIRouter()


@router.get("/", response_model=List[BrandResponse])
async def list_brands(
    project_id: int = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """List all brands, optionally filtered by project_id"""
    query = select(Brand).order_by(Brand.created_at.desc())
    
    if project_id:
        query = query.where(Brand.project_id == project_id)
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    brands = result.scalars().all()
    return brands


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


@router.get("/{brand_id}", response_model=BrandResponse)
async def get_brand(brand_id: int, db: AsyncSession = Depends(get_db)):
    """Get a brand by ID"""
    result = await db.execute(select(Brand).where(Brand.id == brand_id))
    brand = result.scalar_one_or_none()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
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


@router.delete("/{brand_id}")
async def delete_brand(brand_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a brand"""
    result = await db.execute(select(Brand).where(Brand.id == brand_id))
    brand = result.scalar_one_or_none()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    await db.delete(brand)
    await db.commit()
    return {"message": "Brand deleted"}


@router.get("/{brand_id}/design-system", response_model=List[DesignSystemResponse])
async def get_brand_design_systems(brand_id: int, db: AsyncSession = Depends(get_db)):
    """Get all design systems for a brand"""
    result = await db.execute(
        select(DesignSystem)
        .where(DesignSystem.brand_id == brand_id)
        .order_by(DesignSystem.created_at.desc())
    )
    design_systems = result.scalars().all()
    return design_systems


@router.post("/{brand_id}/design-system", response_model=DesignSystemResponse)
async def create_design_system(
    brand_id: int,
    ds_data: DesignSystemCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a design system for a brand"""
    # Verify brand exists
    result = await db.execute(select(Brand).where(Brand.id == brand_id))
    brand = result.scalar_one_or_none()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    design_system = DesignSystem(
        brand_id=brand_id,
        tokens=json.dumps(ds_data.tokens) if ds_data.tokens else None,
        components=json.dumps(ds_data.components) if ds_data.components else None
    )
    db.add(design_system)
    await db.commit()
    await db.refresh(design_system)
    return design_system