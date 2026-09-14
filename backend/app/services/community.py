"""
Community service - User profiles, shared designs, reviews
"""
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime
import uuid
from enum import Enum

logger = logging.getLogger(__name__)


class UserRole(str, Enum):
    VISITOR = "visitor"
    USER = "user"
    CREATOR = "creator"
    MODERATOR = "moderator"
    ADMIN = "admin"


class Review:
    """Represents a review on content."""
    
    def __init__(
        self,
        id: str,
        content_type: str,
        content_id: str,
        user_id: str,
        user_name: str,
        rating: int,
        comment: str = None,
        status: str = "published",
        created_at: datetime = None
    ):
        self.id = id
        self.content_type = content_type
        self.content_id = content_id
        self.user_id = user_id
        self.user_name = user_name
        self.rating = rating
        self.comment = comment
        self.status = status
        self.created_at = created_at or datetime.utcnow()
        self.helpful_count = 0
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "content_type": self.content_type,
            "content_id": self.content_id,
            "user_id": self.user_id,
            "user_name": self.user_name,
            "rating": self.rating,
            "comment": self.comment,
            "status": self.status,
            "helpful_count": self.helpful_count,
            "created_at": self.created_at.isoformat()
        }


class SharedDesign:
    """Represents a shared design from community."""
    
    def __init__(
        self,
        id: str,
        title: str,
        description: str,
        user_id: str,
        user_name: str,
        palette: Dict[str, str],
        typography: Dict[str, str],
        preview_image: str = None,
        tags: List[str] = None,
        category: str = "general",
        likes_count: int = 0,
        views_count: int = 0,
        status: str = "published",
        created_at: datetime = None
    ):
        self.id = id
        self.title = title
        self.description = description
        self.user_id = user_id
        self.user_name = user_name
        self.palette = palette
        self.typography = typography
        self.preview_image = preview_image
        self.tags = tags or []
        self.category = category
        self.likes_count = likes_count
        self.views_count = views_count
        self.status = status
        self.created_at = created_at or datetime.utcnow()
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "user_id": self.user_id,
            "user_name": self.user_name,
            "palette": self.palette,
            "typography": self.typography,
            "preview_image": self.preview_image,
            "tags": self.tags,
            "category": self.category,
            "likes_count": self.likes_count,
            "views_count": self.views_count,
            "status": self.status,
            "created_at": self.created_at.isoformat()
        }


class UserProfile:
    """Represents a community user profile."""
    
    def __init__(
        self,
        id: str,
        email: str,
        name: str,
        role: UserRole = UserRole.USER,
        bio: str = None,
        avatar_url: str = None,
        is_verified: bool = False,
        join_date: datetime = None,
        designs_count: int = 0,
        templates_count: int = 0,
        ratings_count: int = 0,
        avg_rating: float = 0.0,
        reputation: int = 0
    ):
        self.id = id
        self.email = email
        self.name = name
        self.role = role
        self.bio = bio
        self.avatar_url = avatar_url
        self.is_verified = is_verified
        self.join_date = join_date or datetime.utcnow()
        self.designs_count = designs_count
        self.templates_count = templates_count
        self.ratings_count = ratings_count
        self.avg_rating = avg_rating
        self.reputation = reputation
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "role": self.role.value,
            "bio": self.bio,
            "avatar_url": self.avatar_url,
            "is_verified": self.is_verified,
            "join_date": self.join_date.isoformat(),
            "designs_count": self.designs_count,
            "templates_count": self.templates_count,
            "ratings_count": self.ratings_count,
            "avg_rating": self.avg_rating,
            "reputation": self.reputation
        }


class CommunityService:
    """Service for community features."""
    
    def __init__(self):
        self.users: Dict[str, UserProfile] = {}
        self.designs: Dict[str, SharedDesign] = {}
        self.reviews: Dict[str, Review] = {}
        self._init_sample_data()
    
    def _init_sample_data(self):
        """Initialize with sample community data."""
        # Create sample users
        self._create_user("admin", "admin@designsystem.com", "Admin User", UserRole.ADMIN)
        self._create_user("creator1", "creator1@example.com", "Creative Studio", UserRole.CREATOR)
        self._create_user("creator2", "creator2@example.com", "Design Master", UserRole.CREATOR)
        
        # Create sample shared designs
        self._create_design(
            title="Ocean Brand Kit",
            description="Fresh ocean-inspired brand kit with calming blues",
            user_id="creator1",
            user_name="Creative Studio",
            palette={
                "primary": "#0EA5E9", "secondary": "#06B6D4", "accent": "#F59E0B",
                "neutral": "#6B7280", "light": "#F0F9FF", "dark": "#0C4A6E"
            },
            typography={"heading": "Inter", "body": "Inter", "mono": "JetBrains Mono"},
            category="nature",
            tags=["blue", "ocean", "calm", "fresh"]
        )
        
        self._create_design(
            title="Minimal Portfolio",
            description="Clean minimal portfolio template for creatives",
            user_id="creator2",
            user_name="Design Master",
            palette={
                "primary": "#111827", "secondary": "#374151", "accent": "#6366F1",
                "neutral": "#6B7280", "light": "#F9FAFB", "dark": "#030712"
            },
            typography={"heading": "Inter", "body": "Inter", "mono": "JetBrains Mono"},
            category="minimal",
            tags=["minimal", "clean", "portfolio", "simple"]
        )
    
    def _create_user(self, email: str, name: str, role: UserRole) -> UserProfile:
        user_id = str(uuid.uuid4())[:8]
        user = UserProfile(
            id=user_id,
            email=email,
            name=name,
            role=role
        )
        self.users[user_id] = user
        return user
    
    def _create_design(
        self,
        title: str,
        description: str,
        user_id: str,
        user_name: str,
        palette: Dict[str, str],
        typography: Dict[str, str],
        category: str = "general",
        tags: List[str] = None
    ) -> SharedDesign:
        design_id = str(uuid.uuid4())[:8]
        design = SharedDesign(
            id=design_id,
            title=title,
            description=description,
            user_id=user_id,
            user_name=user_name,
            palette=palette,
            typography=typography,
            category=category,
            tags=tags or []
        )
        self.designs[design_id] = design
        return design
    
    def create_design(
        self,
        title: str,
        description: str,
        user_id: str,
        palette: Dict[str, str],
        typography: Dict[str, str],
        category: str = "general",
        tags: List[str] = None
    ) -> Optional[SharedDesign]:
        if user_id not in self.users:
            return None
        
        user = self.users[user_id]
        design_id = str(uuid.uuid4())[:8]
        design = SharedDesign(
            id=design_id,
            title=title,
            description=description,
            user_id=user_id,
            user_name=user.name,
            palette=palette,
            typography=typography,
            category=category,
            tags=tags or []
        )
        self.designs[design_id] = design
        return design
    
    def get_design(self, design_id: str) -> Optional[SharedDesign]:
        return self.designs.get(design_id)
    
    def list_designs(
        self,
        category: str = None,
        tags: List[str] = None,
        user_id: str = None,
        search: str = None,
        sort_by: str = "newest",
        limit: int = 20
    ) -> List[SharedDesign]:
        results = list(self.designs.values())
        
        if category:
            results = [d for d in results if d.category == category]
        
        if tags:
            results = [d for d in results if any(tag in d.tags for tag in tags)]
        
        if user_id:
            results = [d for d in results if d.user_id == user_id]
        
        if search:
            search_lower = search.lower()
            results = [d for d in results if 
                      search_lower in d.title.lower() or
                      search_lower in d.description.lower() or
                      any(search_lower in tag.lower() for tag in d.tags)]
        
        if sort_by == "popular":
            results = sorted(results, key=lambda x: x.likes_count, reverse=True)
        elif sort_by == "trending":
            results = sorted(results, key=lambda x: (x.likes_count, x.views_count), reverse=True)
        else:
            results = sorted(results, key=lambda x: x.created_at, reverse=True)
        
        return results[:limit]
    
    def like_design(self, design_id: str, user_id: str) -> bool:
        design = self.designs.get(design_id)
        if design and user_id != design.user_id:
            design.likes_count += 1
            return True
        return False
    
    def view_design(self, design_id: str):
        design = self.designs.get(design_id)
        if design:
            design.views_count += 1
    
    def create_review(
        self,
        content_type: str,
        content_id: str,
        user_id: str,
        rating: int,
        comment: str = None
    ) -> Optional[Review]:
        if user_id not in self.users:
            return None
        
        user = self.users[user_id]
        review_id = str(uuid.uuid4())[:8]
        review = Review(
            id=review_id,
            content_type=content_type,
            content_id=content_id,
            user_id=user_id,
            user_name=user.name,
            rating=rating,
            comment=comment
        )
        self.reviews[review_id] = review
        return review
    
    def get_reviews(self, content_type: str, content_id: str) -> List[Review]:
        return [r for r in self.reviews.values() 
                if r.content_type == content_type and r.content_id == content_id and r.status == "published"]
    
    def get_user(self, user_id: str) -> Optional[UserProfile]:
        return self.users.get(user_id)
    
    def get_all_users(self) -> List[UserProfile]:
        return list(self.users.values())
    
    def get_categories(self) -> List[str]:
        return list(set(d.category for d in self.designs.values()))
    
    def get_tags(self) -> List[str]:
        all_tags = set()
        for design in self.designs.values():
            all_tags.update(design.tags)
        return sorted(list(all_tags))
    
    def moderate_review(self, review_id: str, status: str) -> bool:
        review = self.reviews.get(review_id)
        if review:
            review.status = status
            return True
        return False
    
    def get_trending_designs(self, limit: int = 10) -> List[SharedDesign]:
        return sorted(
            self.list_designs(),
            key=lambda x: (x.likes_count * 2 + x.views_count),
            reverse=True
        )[:limit]


# Singleton
_community = None

def get_community() -> CommunityService:
    global _community
    if _community is None:
        _community = CommunityService()
    return _community