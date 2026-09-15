# API Keys Service
"""
Service for managing API keys for SaaS usage
"""
import logging
import secrets
from datetime import datetime, timedelta
from enum import Enum
from typing import Any

logger = logging.getLogger(__name__)


class KeyStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    EXPIRED = "expired"
    SUSPENDED = "suspended"


class UsageTier(str, Enum):
    FREE = "free"
    BASIC = "basic"
    PREMIUM = "premium"
    ENTERPRISE = "enterprise"


class APIKey:
    """Represents an API key."""

    def __init__(
        self,
        id: str,
        name: str,
        key: str,
        user_id: str,
        tier: UsageTier = UsageTier.FREE,
        monthly_limit: int = 1000,
        status: KeyStatus = KeyStatus.ACTIVE,
        expires_at: datetime | None = None,
        created_at: datetime = None
    ):
        self.id = id
        self.name = name
        self.key = key
        self.user_id = user_id
        self.tier = tier
        self.monthly_limit = monthly_limit
        self.status = status
        self.expires_at = expires_at
        self.created_at = created_at or datetime.utcnow()
        self.last_used_at: datetime | None = None
        self.usage_count = 0
        self.usage_this_month = 0

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "key": self.key[:8] + "..." + self.key[-4:],  # Mask key
            "full_key": self.key,  # Only returned on creation
            "user_id": self.user_id,
            "tier": self.tier.value,
            "monthly_limit": self.monthly_limit,
            "status": self.status.value,
            "expires_at": self.expires_at.isoformat() if self.expires_at else None,
            "created_at": self.created_at.isoformat(),
            "last_used_at": self.last_used_at.isoformat() if self.last_used_at else None,
            "usage_count": self.usage_count,
            "usage_this_month": self.usage_this_month
        }

    def is_expired(self) -> bool:
        return self.expires_at and self.expires_at < datetime.utcnow()

    def is_active(self) -> bool:
        return self.status == KeyStatus.ACTIVE and not self.is_expired()


class APIKeysService:
    """Service for managing API keys."""

    def __init__(self):
        self.keys: dict[str, APIKey] = {}
        self.usage_logs: list[dict[str, Any]] = []

    def create_key(
        self,
        name: str,
        user_id: str,
        tier: UsageTier = UsageTier.FREE,
        expires_in_days: int | None = None
    ) -> APIKey:
        """Create a new API key."""
        key_id = secrets.token_hex(16)
        key_value = f"or_{secrets.token_urlsafe(32)}"

        expires_at = None
        if expires_in_days:
            expires_at = datetime.utcnow() + timedelta(days=expires_in_days)

        key = APIKey(
            id=key_id,
            name=name,
            key=key_value,
            user_id=user_id,
            tier=tier,
            monthly_limit=self._get_tier_limit(tier),
            expires_at=expires_at
        )

        self.keys[key_id] = key
        logger.info(f"Created API key {key_id} for user {user_id}")

        return key

    def get_key(self, key_id: str) -> APIKey | None:
        """Get key by ID."""
        return self.keys.get(key_id)

    def get_key_by_value(self, key_value: str) -> APIKey | None:
        """Get key by value (for authentication)."""
        for key in self.keys.values():
            if key.key == key_value:
                return key
        return None

    def validate_key(self, key_value: str) -> tuple:
        """Validate API key and return (is_valid, key_or_error)."""
        key = self.get_key_by_value(key_value)

        if not key:
            return False, "Invalid API key"

        if key.status != KeyStatus.ACTIVE:
            return False, f"Key is {key.status.value}"

        if key.is_expired():
            return False, "Key has expired"

        if key.usage_this_month >= key.monthly_limit:
            return False, "Monthly usage limit exceeded"

        # Update usage
        key.usage_this_month += 1
        key.usage_count += 1
        key.last_used_at = datetime.utcnow()

        # Log usage
        self.usage_logs.append({
            "key_id": key.id,
            "user_id": key.user_id,
            "timestamp": datetime.utcnow().isoformat(),
            "endpoint": None,  # Would be set by middleware
            "status": "success"
        })

        return True, key

    def list_keys(self, user_id: str | None = None) -> list[dict[str, Any]]:
        """List API keys, optionally filtered by user."""
        keys = []
        for key in self.keys.values():
            if user_id and key.user_id != user_id:
                continue
            keys.append(key.to_dict())
        return keys

    def delete_key(self, key_id: str) -> bool:
        """Delete an API key."""
        if key_id in self.keys:
            del self.keys[key_id]
            logger.info(f"Deleted API key {key_id}")
            return True
        return False

    def get_usage_stats(self, key_id: str | None = None) -> dict[str, Any]:
        """Get usage statistics."""
        if key_id:
            key = self.keys.get(key_id)
            if not key:
                return {"error": "Key not found"}

            return {
                "key_id": key_id,
                "name": key.name,
                "tier": key.tier.value,
                "monthly_limit": key.monthly_limit,
                "usage_this_month": key.usage_this_month,
                "total_usage": key.usage_count,
                "last_used_at": key.last_used_at.isoformat() if key.last_used_at else None,
                "usage_percentage": round(key.usage_this_month / key.monthly_limit * 100, 2)
            }

        # Aggregate stats
        total_keys = len(self.keys)
        active_keys = sum(1 for k in self.keys.values() if k.is_active())
        total_usage = sum(k.usage_this_month for k in self.keys.values())

        return {
            "total_keys": total_keys,
            "active_keys": active_keys,
            "total_usage_this_month": total_usage,
            "recent_usage": self.usage_logs[-100:]
        }

    def _get_tier_limit(self, tier: UsageTier) -> int:
        """Get monthly limit for tier."""
        limits = {
            UsageTier.FREE: 1000,
            UsageTier.BASIC: 10000,
            UsageTier.PREMIUM: 100000,
            UsageTier.ENTERPRISE: 1000000
        }
        return limits.get(tier, 1000)

    def check_rate_limit(self, key: APIKey, endpoint: str) -> bool:
        """Check if request is within rate limit."""
        # Get recent requests for this key
        recent_requests = [
            log for log in self.usage_logs
            if log["key_id"] == key.id
            and log["timestamp"] > (datetime.utcnow() - timedelta(minutes=1)).isoformat()
        ]

        # Rate limits per minute
        limits = {
            UsageTier.FREE: 10,
            UsageTier.BASIC: 50,
            UsageTier.PREMIUM: 200,
            UsageTier.ENTERPRISE: 1000
        }

        max_requests = limits.get(key.tier, 10)
        return len(recent_requests) < max_requests


# Singleton
_api_keys_service = None

def get_api_keys_service() -> APIKeysService:
    """Get or create API keys service instance."""
    global _api_keys_service
    if _api_keys_service is None:
        _api_keys_service = APIKeysService()
    return _api_keys_service
