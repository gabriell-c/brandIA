"""
Palette database - Community-contributed color palettes
"""
import logging
from datetime import datetime
from typing import Any

logger = logging.getLogger(__name__)


class Comment:
    """Represents a user comment on a palette."""

    def __init__(
        self,
        id: int,
        palette_id: int,
        author: str,
        content: str,
        created_at: datetime = None
    ):
        self.id = id
        self.palette_id = palette_id
        self.author = author
        self.content = content
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> dict[str, Any]:
        """Convert to dictionary."""
        return {
            "id": self.id,
            "palette_id": self.palette_id,
            "author": self.author,
            "content": self.content,
            "created_at": self.created_at.isoformat()
        }


class Palette:
    """Represents a community palette."""

    def __init__(
        self,
        id: int,
        name: str,
        colors: dict[str, str],
        description: str,
        author: str,
        category: str,
        tags: list[str],
        rating: float = 0.0,
        votes: int = 0,
        created_at: datetime = None,
        updated_at: datetime = None
    ):
        self.id = id
        self.name = name
        self.colors = colors
        self.description = description
        self.author = author
        self.category = category
        self.tags = tags
        self.rating = rating
        self.votes = votes
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()

    def to_dict(self) -> dict[str, Any]:
        """Convert to dictionary."""
        return {
            "id": self.id,
            "name": self.name,
            "colors": self.colors,
            "description": self.description,
            "author": self.author,
            "category": self.category,
            "tags": self.tags,
            "rating": self.rating,
            "votes": self.votes,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }

    def add_vote(self, score: int):
        """Add a vote to the palette."""
        self.votes += 1
        self.rating = (self.rating * (self.votes - 1) + score) / self.votes
        self.updated_at = datetime.utcnow()

    def add_comment(self, comment: Comment):
        """Add a comment to the palette."""
        if not hasattr(self, 'comments'):
            self.comments = []
        self.comments.append(comment)
        self.updated_at = datetime.utcnow()

    def get_comments(self) -> list[Comment]:
        """Get all comments for this palette."""
        if not hasattr(self, 'comments'):
            self.comments = []
        return sorted(self.comments, key=lambda c: c.created_at, reverse=True)


class PaletteDatabase:
    """In-memory palette database with community contributions."""

    def __init__(self):
        self.palettes: dict[int, Palette] = {}
        self._next_id = 1
        self._init_sample_palettes()

    def _init_sample_palettes(self):
        """Initialize with sample palettes."""
        samples = [
            {
                "name": "Ocean Breeze",
                "colors": {
                    "primary": "#0EA5E9",
                    "secondary": "#06B6D4",
                    "accent": "#F59E0B",
                    "neutral": "#6B7280",
                    "light": "#F0F9FF",
                    "dark": "#0C4A6E"
                },
                "description": "Fresh and calming ocean-inspired palette",
                "author": "DesignTeam",
                "category": "nature",
                "tags": ["blue", "ocean", "calm", "fresh"]
            },
            {
                "name": "Forest Dawn",
                "colors": {
                    "primary": "#10B981",
                    "secondary": "#059669",
                    "accent": "#84CC16",
                    "neutral": "#4B5563",
                    "light": "#ECFDF5",
                    "dark": "#064E3B"
                },
                "description": "Natural forest tones for organic brands",
                "author": "EcoDesigner",
                "category": "nature",
                "tags": ["green", "forest", "nature", "organic"]
            },
            {
                "name": "Sunset Boulevard",
                "colors": {
                    "primary": "#F97316",
                    "secondary": "#EC4899",
                    "accent": "#8B5CF6",
                    "neutral": "#78716C",
                    "light": "#FFF7ED",
                    "dark": "#451A03"
                },
                "description": "Warm sunset gradient for creative brands",
                "author": "CreativeStudio",
                "category": "creative",
                "tags": ["warm", "sunset", "creative", "vibrant"]
            },
            {
                "name": "Monochrome Professional",
                "colors": {
                    "primary": "#111827",
                    "secondary": "#374151",
                    "accent": "#6366F1",
                    "neutral": "#6B7280",
                    "light": "#F9FAFB",
                    "dark": "#030712"
                },
                "description": "Clean monochrome with blue accent",
                "author": "Minimalist",
                "category": "minimal",
                "tags": ["monochrome", "professional", "clean", "minimal"]
            }
        ]

        for sample in samples:
            self.create(
                name=sample["name"],
                colors=sample["colors"],
                description=sample["description"],
                author=sample["author"],
                category=sample["category"],
                tags=sample["tags"]
            )

    def create(
        self,
        name: str,
        colors: dict[str, str],
        description: str,
        author: str,
        category: str,
        tags: list[str] = None
    ) -> Palette:
        """Create a new palette."""
        palette = Palette(
            id=self._next_id,
            name=name,
            colors=colors,
            description=description,
            author=author,
            category=category,
            tags=tags or []
        )
        self.palettes[self._next_id] = palette
        self._next_id += 1
        return palette

    def get_all(self, category: str = None, tags: list[str] = None, search: str = None) -> list[Palette]:
        """Get all palettes with optional filters."""
        results = list(self.palettes.values())

        if category:
            results = [p for p in results if p.category == category]

        if tags:
            results = [p for p in results if any(tag in p.tags for tag in tags)]

        if search:
            search_lower = search.lower()
            results = [p for p in results if
                      search_lower in p.name.lower() or
                      search_lower in p.description.lower() or
                      any(search_lower in tag.lower() for tag in p.tags)]

        return sorted(results, key=lambda x: x.rating, reverse=True)

    def get_by_id(self, palette_id: int) -> Palette | None:
        """Get palette by ID."""
        return self.palettes.get(palette_id)

    def vote(self, palette_id: int, score: int) -> Palette | None:
        """Vote for a palette (1-5 stars)."""
        palette = self.palettes.get(palette_id)
        if palette:
            palette.add_vote(score)
        return palette

    def get_categories(self) -> list[str]:
        """Get all available categories."""
        return list(set(p.category for p in self.palettes.values()))

    def get_tags(self) -> list[str]:
        """Get all available tags."""
        all_tags = set()
        for palette in self.palettes.values():
            all_tags.update(palette.tags)
        return sorted(list(all_tags))

    def create_comment(
        self,
        palette_id: int,
        author: str,
        content: str
    ) -> Comment | None:
        """Create a new comment on a palette."""
        palette = self.palettes.get(palette_id)
        if not palette:
            return None

        comment = Comment(
            id=len(palette.get_comments()) + 1,
            palette_id=palette_id,
            author=author,
            content=content
        )
        palette.add_comment(comment)
        return comment

    def get_comments(self, palette_id: int) -> list[Comment]:
        """Get all comments for a palette."""
        palette = self.palettes.get(palette_id)
        if not palette:
            return []
        return palette.get_comments()


# Singleton instance
_palette_db = None

def get_palette_db() -> PaletteDatabase:
    """Get or create palette database instance."""
    global _palette_db
    if _palette_db is None:
        _palette_db = PaletteDatabase()
    return _palette_db
