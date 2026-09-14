from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from datetime import datetime

from app.database import get_db
from app.models import Project, Brand
from app.schemas import ProjectCreate, ProjectUpdate, ProjectResponse, BrandCreate, BrandResponse

router = APIRouter()


@router.get("/", response_model=List[ProjectResponse])
async def list_projects(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    """List all projects"""
    result = await db.execute(
        select(Project).offset(skip).limit(limit).order_by(Project.created_at.desc())
    )
    projects = result.scalars().all()
    return projects


@router.post("/", response_model=ProjectResponse)
async def create_project(project_data: ProjectCreate, db: AsyncSession = Depends(get_db)):
    """Create a new project"""
    project = Project(name=project_data.name)
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: int, db: AsyncSession = Depends(get_db)):
    """Get a project by ID"""
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(project_id: int, project_data: ProjectUpdate, db: AsyncSession = Depends(get_db)):
    """Update a project"""
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project_data.name:
        project.name = project_data.name
    await db.commit()
    await db.refresh(project)
    return project


@router.delete("/{project_id}")
async def delete_project(project_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a project"""
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    await db.delete(project)
    await db.commit()
    return {"message": "Project deleted"}


@router.get("/{project_id}/brand", response_model=BrandResponse)
async def get_project_brand(project_id: int, db: AsyncSession = Depends(get_db)):
    """Get the brand for a project"""
    result = await db.execute(
        select(Brand).where(Brand.project_id == project_id).order_by(Brand.created_at.desc()).limit(1)
    )
    brand = result.scalar_one_or_none()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found for this project")
    return brand