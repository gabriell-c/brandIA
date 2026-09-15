"""
API Keys routes
"""
from fastapi import APIRouter, HTTPException, Depends, Request
from typing import Dict, Any, Optional, List
import logging

from app.services.api_keys import (
    get_api_keys_service,
    APIKeysService,
    UsageTier
)

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("")
async def list_keys(
    user_id: Optional[str] = None,
    service: APIKeysService = Depends(get_api_keys_service)
) -> List[Dict[str, Any]]:
    """List all API keys, optionally filtered by user."""
    return service.list_keys(user_id)


@router.post("")
async def create_key(
    name: str,
    user_id: str = "anonymous",
    tier: UsageTier = UsageTier.FREE,
    expires_in_days: Optional[int] = None,
    service: APIKeysService = Depends(get_api_keys_service)
) -> Dict[str, Any]:
    """Create a new API key."""
    key = service.create_key(
        name=name,
        user_id=user_id,
        tier=tier,
        expires_in_days=expires_in_days
    )
    
    # Return full key only on creation
    response = key.to_dict()
    response["full_key"] = key.key  # This is the only time the full key is returned
    
    return response


@router.delete("/{key_id}")
async def delete_key(
    key_id: str,
    service: APIKeysService = Depends(get_api_keys_service)
) -> Dict[str, Any]:
    """Delete an API key."""
    success = service.delete_key(key_id)
    if not success:
        raise HTTPException(status_code=404, detail="Key not found")
    
    return {"success": True, "message": "Key deleted"}


@router.get("/stats")
async def get_stats(
    key_id: Optional[str] = None,
    service: APIKeysService = Depends(get_api_keys_service)
) -> Dict[str, Any]:
    """Get usage statistics."""
    return service.get_usage_stats(key_id)


@router.get("/tiers")
async def get_tiers() -> Dict[str, Any]:
    """Get available pricing tiers."""
    tiers = {
        "free": {
            "name": "Free",
            "monthly_limit": 1000,
            "requests_per_minute": 10,
            "features": ["Basic API access", "Standard support"]
        },
        "basic": {
            "name": "Basic",
            "monthly_limit": 10000,
            "requests_per_minute": 50,
            "price": 9.99,
            "features": ["Everything in Free", "Faster rate limits", "Email support"]
        },
        "premium": {
            "name": "Premium",
            "monthly_limit": 100000,
            "requests_per_minute": 200,
            "price": 49.99,
            "features": ["Everything in Basic", "Priority support", "Advanced analytics"]
        },
        "enterprise": {
            "name": "Enterprise",
            "monthly_limit": 1000000,
            "requests_per_minute": 1000,
            "price": 199.99,
            "features": ["Everything in Premium", "Dedicated support", "Custom SLA", "White-label options"]
        }
    }
    return {"tiers": tiers}


@router.post("/usage/check")
async def check_usage_limit(
    request: Request,
    service: APIKeysService = Depends(get_api_keys_service)
) -> Dict[str, Any]:
    """Check if request is within usage limit."""
    api_key = request.headers.get("X-API-Key")
    if not api_key:
        raise HTTPException(status_code=401, detail="API key required")
    
    key = service.get_key_by_value(api_key)
    if not key:
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    is_within_limit = key.usage_this_month < key.monthly_limit
    
    return {
        "is_within_limit": is_within_limit,
        "usage_this_month": key.usage_this_month,
        "monthly_limit": key.monthly_limit,
        "percentage_used": round(key.usage_this_month / key.monthly_limit * 100, 2) if key.monthly_limit > 0 else 0
    }