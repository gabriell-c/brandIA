"""
Templates service - Pre-made design templates for common segments
"""
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime

logger = logging.getLogger(__name__)


class Template:
    """Represents a design template."""
    
    def __init__(
        self,
        id: int,
        name: str,
        description: str,
        segment: str,
        palette: Dict[str, str],
        typography: Dict[str, str],
        preview_image: str = None,
        author: str = "System",
        is_premium: bool = False,
        tags: List[str] = None,
        created_at: datetime = None
    ):
        self.id = id
        self.name = name
        self.description = description
        self.segment = segment
        self.palette = palette
        self.typography = typography
        self.preview_image = preview_image
        self.author = author
        self.is_premium = is_premium
        self.tags = tags or []
        self.created_at = created_at or datetime.utcnow()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "segment": self.segment,
            "palette": self.palette,
            "typography": self.typography,
            "preview_image": self.preview_image,
            "author": self.author,
            "is_premium": self.is_premium,
            "tags": self.tags,
            "created_at": self.created_at.isoformat()
        }


class TemplateDatabase:
    """In-memory template database."""
    
    def __init__(self):
        self.templates: Dict[int, Template] = {}
        self._next_id = 1
        self._init_sample_templates()
    
    def _init_sample_templates(self):
        """Initialize with sample templates."""
        samples = [
            {
                "name": "Tech Startup",
                "description": "Modern and minimal template for tech companies and startups",
                "segment": "technology",
                "palette": {
                    "primary": "#3B82F6",
                    "secondary": "#10B981",
                    "accent": "#8B5CF6",
                    "neutral": "#6B7280",
                    "light": "#F3F4F6",
                    "dark": "#111827"
                },
                "typography": {
                    "heading": "Inter",
                    "body": "Inter",
                    "mono": "JetBrains Mono"
                },
                "tags": ["modern", "tech", "startup", "minimal"]
            },
            {
                "name": "Creative Portfolio",
                "description": "Bold and creative template for designers and artists",
                "segment": "creative",
                "palette": {
                    "primary": "#EC4899",
                    "secondary": "#8B5CF6",
                    "accent": "#F59E0B",
                    "neutral": "#6B7280",
                    "light": "#FDF2F8",
                    "dark": "#1F2937"
                },
                "typography": {
                    "heading": "Playfair Display",
                    "body": "Inter",
                    "mono": "Fira Code"
                },
                "tags": ["creative", "portfolio", "bold", "artistic"]
            },
            {
                "name": "E-commerce",
                "description": "Clean and conversion-focused template for online stores",
                "segment": "ecommerce",
                "palette": {
                    "primary": "#F97316",
                    "secondary": "#06B6D4",
                    "accent": "#84CC16",
                    "neutral": "#4B5563",
                    "light": "#FFF7ED",
                    "dark": "#1F2937"
                },
                "typography": {
                    "heading": "Montserrat",
                    "body": "Open Sans",
                    "mono": "Roboto Mono"
                },
                "tags": ["ecommerce", "commerce", "clean", "conversion"]
            },
            {
                "name": "Blog/Content",
                "description": "Readable and comfortable template for content creators",
                "segment": "blog",
                "palette": {
                    "primary": "#10B981",
                    "secondary": "#0EA5E9",
                    "accent": "#F59E0B",
                    "neutral": "#4B5563",
                    "light": "#F0FDF4",
                    "dark": "#14532D"
                },
                "typography": {
                    "heading": "Merriweather",
                    "body": "Merriweather",
                    "mono": "Source Code Pro"
                },
                "tags": ["blog", "content", "readable", "editorial"]
            },
            {
                "name": "Corporate",
                "description": "Professional and trustworthy template for businesses",
                "segment": "corporate",
                "palette": {
                    "primary": "#1E40AF",
                    "secondary": "#059669",
                    "accent": "#DC2626",
                    "neutral": "#374151",
                    "light": "#F3F4F6",
                    "dark": "#111827"
                },
                "typography": {
                    "heading": "Roboto",
                    "body": "Roboto",
                    "mono": "Roboto Mono"
                },
                "tags": ["corporate", "business", "professional", "trustworthy"]
            },
            {
                "name": "Food & Restaurant",
                "description": "Warm and appetizing template for food businesses",
                "segment": "food",
                "palette": {
                    "primary": "#B91C1C",
                    "secondary": "#92400E",
                    "accent": "#65A30D",
                    "neutral": "#78716C",
                    "light": "#FEF2F2",
                    "dark": "#451A03"
                },
                "typography": {
                    "heading": "Playfair Display",
                    "body": "Lato",
                    "mono": "Courier Prime"
                },
                "tags": ["food", "restaurant", "warm", "appetizing"]
            }
        ]
        
        for sample in samples:
            self.create(
                name=sample["name"],
                description=sample["description"],
                segment=sample["segment"],
                palette=sample["palette"],
                typography=sample["typography"],
                tags=sample["tags"]
            )
    
    def create(
        self,
        name: str,
        description: str,
        segment: str,
        palette: Dict[str, str],
        typography: Dict[str, str],
        preview_image: str = None,
        author: str = "System",
        is_premium: bool = False,
        tags: List[str] = None
    ) -> Template:
        """Create a new template."""
        template = Template(
            id=self._next_id,
            name=name,
            description=description,
            segment=segment,
            palette=palette,
            typography=typography,
            preview_image=preview_image,
            author=author,
            is_premium=is_premium,
            tags=tags or []
        )
        self.templates[self._next_id] = template
        self._next_id += 1
        return template
    
    def get_all(self, segment: str = None, tags: List[str] = None, search: str = None) -> List[Template]:
        """Get all templates with optional filters."""
        results = list(self.templates.values())
        
        if segment:
            results = [t for t in results if t.segment == segment]
        
        if tags:
            results = [t for t in results if any(tag in t.tags for tag in tags)]
        
        if search:
            search_lower = search.lower()
            results = [t for t in results if 
                      search_lower in t.name.lower() or
                      search_lower in t.description.lower() or
                      search_lower in t.segment.lower() or
                      any(search_lower in tag.lower() for tag in t.tags)]
        
        return results
    
    def get_by_id(self, template_id: int) -> Optional[Template]:
        """Get template by ID."""
        return self.templates.get(template_id)
    
    def get_segments(self) -> List[str]:
        """Get all available segments."""
        return list(set(t.segment for t in self.templates.values()))
    
    def get_tags(self) -> List[str]:
        """Get all available tags."""
        all_tags = set()
        for template in self.templates.values():
            all_tags.update(template.tags)
        return sorted(list(all_tags))
    
    def get_premium(self) -> List[Template]:
        """Get all premium templates."""
        return [t for t in self.templates.values() if t.is_premium]


# Singleton instance
_template_db = None

def get_template_db() -> TemplateDatabase:
    """Get or create template database instance."""
    global _template_db
    if _template_db is None:
        _template_db = TemplateDatabase()
    return _template_db