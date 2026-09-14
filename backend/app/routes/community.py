"""
Community Routes - Marketplace, Reviews, Designs, User Profiles
"""
from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, List, Optional
import logging

from app.schemas import (
    CommentCreate, CommentResponse,
    FontPairingCreate, FontPairingResponse,
    TemplateResponse
)
from app.services.marketplace import get_marketplace, MarketplaceService, LicenseType
from app.services.community import get_community, CommunityService, UserRole
from app.services.versioning import get_versioning_service, VersionService

logger = logging.getLogger(__name__)

router = APIRouter()


# Marketplace endpoints
@router.get("/marketplace/templates")
async def list_marketplace_templates(
    status: str = "active",
    segment: Optional[str] = None,
    tags: Optional[str] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    search: Optional[str] = None
):
    """List marketplace templates."""
    marketplace = get_marketplace()
    
    status_enum = None
    if status:
        from app.services.marketplace import TemplateStatus
        status_enum = TemplateStatus(status)
    
    tag_list = tags.split(',') if tags else None
    templates = marketplace.list_templates(
        status=status_enum,
        segment=segment,
        tags=tag_list,
        min_price=min_price,
        max_price=max_price,
        search=search
    )
    
    return {
        "data": [t.to_dict() for t in templates],
        "segments": marketplace.get_segments(),
        "tags": marketplace.get_tags()
    }


@router.get("/marketplace/templates/{template_id}")
async def get_marketplace_template(template_id: str):
    """Get a specific marketplace template."""
    marketplace = get_marketplace()
    template = marketplace.get_template(template_id)
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    return template.to_dict()


@router.post("/marketplace/templates/{template_id}/checkout")
async def create_checkout_session(
    template_id: str,
    buyer_email: str,
    success_url: str,
    cancel_url: str
):
    """Create a Stripe checkout session for a template."""
    marketplace = get_marketplace()
    
    try:
        session = marketplace.create_stripe_checkout_session(
            template_id=template_id,
            buyer_email=buyer_email,
            success_url=success_url,
            cancel_url=cancel_url
        )
        return session
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/marketplace/purchases")
async def get_user_purchases(user_id: str):
    """Get all purchases for a user."""
    marketplace = get_marketplace()
    purchases = marketplace.get_user_purchases(user_id)
    return [p.to_dict() for p in purchases]


# Community design endpoints
@router.get("/community/designs")
async def list_community_designs(
    category: Optional[str] = None,
    tags: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = "newest",
    limit: int = 20
):
    """List community shared designs."""
    community = get_community()
    
    tag_list = tags.split(',') if tags else None
    designs = community.list_designs(
        category=category,
        tags=tag_list,
        search=search,
        sort_by=sort_by,
        limit=limit
    )
    
    return {
        "data": [d.to_dict() for d in designs],
        "categories": community.get_categories(),
        "tags": community.get_tags()
    }


@router.get("/community/designs/trending")
async def get_trending_designs(limit: int = 10):
    """Get trending designs."""
    community = get_community()
    designs = community.get_trending_designs(limit)
    return [d.to_dict() for d in designs]


@router.post("/community/designs/{design_id}/like")
async def like_design(design_id: str, user_id: str):
    """Like a design."""
    community = get_community()
    success = community.like_design(design_id, user_id)
    
    if not success:
        raise HTTPException(status_code=400, detail="Failed to like design")
    
    return {"success": True}


@router.post("/community/designs/{design_id}/view")
async def view_design(design_id: str):
    """Track design view."""
    community = get_community()
    community.view_design(design_id)
    return {"success": True}


# Design submission endpoint
@router.post("/community/designs")
async def submit_design(
    request: Dict[str, Any]
):
    """Submit a new design to community."""
    community = get_community()
    
    design = community.create_design(
        title=request.get("title", ""),
        description=request.get("description", ""),
        user_id=request.get("user_id", ""),
        palette=request.get("palette", {}),
        typography=request.get("typography", {}),
        category=request.get("category", "general"),
        tags=request.get("tags", [])
    )
    
    if not design:
        raise HTTPException(status_code=404, detail="User not found")
    
    return design.to_dict()


# Reviews endpoints
@router.get("/reviews/{content_type}/{content_id}")
async def get_reviews(content_type: str, content_id: str):
    """Get reviews for content."""
    community = get_community()
    reviews = community.get_reviews(content_type, content_id)
    return [r.to_dict() for r in reviews]


@router.post("/reviews")
async def create_review(request: Dict[str, Any]):
    """Create a new review."""
    community = get_community()
    
    review = community.create_review(
        content_type=request.get("content_type", ""),
        content_id=request.get("content_id", ""),
        user_id=request.get("user_id", ""),
        rating=request.get("rating", 5),
        comment=request.get("comment", "")
    )
    
    if not review:
        raise HTTPException(status_code=404, detail="User not found")
    
    return review.to_dict()


# User profile endpoints
@router.get("/community/users")
async def list_users(role: Optional[str] = None):
    """List community users."""
    community = get_community()
    users = community.get_all_users()
    
    if role:
        users = [u for u in users if u.role.value == role]
    
    return [u.to_dict() for u in users]


@router.get("/community/users/{user_id}")
async def get_user_profile(user_id: str):
    """Get user profile."""
    community = get_community()
    user = community.get_user(user_id)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user.to_dict()


@router.get("/community/users/{user_id}/designs")
async def get_user_designs(user_id: str):
    """Get designs by a user."""
    community = get_community()
    designs = community.list_designs(user_id=user_id)
    return [d.to_dict() for d in designs]


# Versioning endpoints
@router.get("/versions/project/{project_id}")
async def get_project_versions(project_id: str):
    """Get version history for a project."""
    versioning = get_versioning_service()
    versions = versioning.get_project_versions(project_id)
    return {
        "data": [v.to_dict() for v in versions],
        "history": versioning.get_version_history(project_id),
        "changes_count": versioning.get_changes_count(project_id)
    }


@router.get("/versions/project/{project_id}/current")
async def get_current_version(project_id: str):
    """Get current active version."""
    versioning = get_versioning_service()
    current = versioning.get_current_version(project_id)
    
    if not current:
        raise HTTPException(status_code=404, detail="No current version found")
    
    return current.to_dict()


@router.post("/versions/project/{project_id}")
async def create_version(
    project_id: str,
    request: Dict[str, Any]
):
    """Create a new version."""
    versioning = get_versioning_service()
    
    version = versioning.create_version(
        project_id=project_id,
        brand_id=request.get("brand_id", ""),
        name=request.get("name", ""),
        palette=request.get("palette", {}),
        typography=request.get("typography", {}),
        logo_svg=request.get("logo_svg"),
        notes=request.get("notes", ""),
        created_by=request.get("created_by", "")
    )
    
    return version.to_dict()


@router.post("/versions/diff")
async def compare_versions(
    request: Dict[str, str]
):
    """Compare two versions."""
    versioning = get_versioning_service()
    
    diff = versioning.create_diff(
        request.get("version1_id", ""),
        request.get("version2_id", "")
    )
    
    if not diff:
        raise HTTPException(status_code=404, detail="One or both versions not found")
    
    return diff


@router.post("/versions/project/{project_id}/rollback")
async def rollback_version(
    project_id: str,
    request: Dict[str, str]
):
    """Rollback to a previous version."""
    versioning = get_versioning_service()
    
    new_version = versioning.rollback_to_version(
        project_id=project_id,
        version_id=request.get("version_id", ""),
        new_name=request.get("new_name")
    )
    
    if not new_version:
        raise HTTPException(status_code=404, detail="Version not found")
    
    return new_version.to_dict()