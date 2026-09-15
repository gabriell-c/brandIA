"""
Font database - Community-contributed font pairings
"""
import logging
from datetime import datetime
from typing import Any

logger = logging.getLogger(__name__)


class FontPairing:
    """Represents a community font pairing."""

    def __init__(
        self,
        id: int,
        name: str,
        heading_font: str,
        body_font: str,
        mono_font: str,
        description: str,
        author: str,
        style: str,
        tags: list[str],
        rating: float = 0.0,
        votes: int = 0,
        created_at: datetime = None,
        updated_at: datetime = None
    ):
        self.id = id
        self.name = name
        self.heading_font = heading_font
        self.body_font = body_font
        self.mono_font = mono_font
        self.description = description
        self.author = author
        self.style = style
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
            "heading_font": self.heading_font,
            "body_font": self.body_font,
            "mono_font": self.mono_font,
            "description": self.description,
            "author": self.author,
            "style": self.style,
            "tags": self.tags,
            "rating": self.rating,
            "votes": self.votes,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }

    def add_vote(self, score: int):
        """Add a vote to the pairing."""
        self.votes += 1
        self.rating = (self.rating * (self.votes - 1) + score) / self.votes
        self.updated_at = datetime.utcnow()


class FontDatabase:
    """In-memory font pairing database."""

    def __init__(self):
        self.pairings: dict[int, FontPairing] = {}
        self._next_id = 1
        self._init_sample_pairings()

    def _init_sample_pairings(self):
        """Initialize with sample font pairings."""
        samples = [
            {
                "name": "Modern Minimal",
                "heading_font": "Inter",
                "body_font": "Inter",
                "mono_font": "JetBrains Mono",
                "description": "Clean, versatile pairing for modern brands",
                "author": "DesignTeam",
                "style": "modern",
                "tags": ["clean", "modern", "versatile", "tech"]
            },
            {
                "name": "Classic Editorial",
                "heading_font": "Playfair Display",
                "body_font": "Merriweather",
                "mono_font": "Source Code Pro",
                "description": "Elegant serif pairing for editorial and luxury brands",
                "author": "EditorialDesigner",
                "style": "classic",
                "tags": ["elegant", "editorial", "luxury", "serif"]
            },
            {
                "name": "Tech Startup",
                "heading_font": "Space Grotesk",
                "body_font": "IBM Plex Sans",
                "mono_font": "JetBrains Mono",
                "description": "Geometric pairing perfect for tech companies",
                "author": "TechDesigner",
                "style": "tech",
                "tags": ["geometric", "tech", "startup", "modern"]
            },
            {
                "name": "Friendly Approachable",
                "heading_font": "Nunito",
                "body_font": "Open Sans",
                "mono_font": "Fira Code",
                "description": "Warm, rounded fonts for approachable brands",
                "author": "FriendlyDesigner",
                "style": "friendly",
                "tags": ["warm", "friendly", "rounded", "approachable"]
            },
            {
                "name": "Bold Statement",
                "heading_font": "Oswald",
                "body_font": "Roboto",
                "mono_font": "Space Mono",
                "description": "Strong, condensed heading with readable body",
                "author": "BoldDesigner",
                "style": "bold",
                "tags": ["bold", "condensed", "strong", "impact"]
            }
        ]

        for sample in samples:
            self.create(
                name=sample["name"],
                heading_font=sample["heading_font"],
                body_font=sample["body_font"],
                mono_font=sample["mono_font"],
                description=sample["description"],
                author=sample["author"],
                style=sample["style"],
                tags=sample["tags"]
            )

    def create(
        self,
        name: str,
        heading_font: str,
        body_font: str,
        mono_font: str,
        description: str,
        author: str,
        style: str,
        tags: list[str] = None
    ) -> FontPairing:
        """Create a new font pairing."""
        pairing = FontPairing(
            id=self._next_id,
            name=name,
            heading_font=heading_font,
            body_font=body_font,
            mono_font=mono_font,
            description=description,
            author=author,
            style=style,
            tags=tags or []
        )
        self.pairings[self._next_id] = pairing
        self._next_id += 1
        return pairing

    def get_all(self, style: str = None, tags: list[str] = None, search: str = None) -> list[FontPairing]:
        """Get all pairings with optional filters."""
        results = list(self.pairings.values())

        if style:
            results = [p for p in results if p.style == style]

        if tags:
            results = [p for p in results if any(tag in p.tags for tag in tags)]

        if search:
            search_lower = search.lower()
            results = [p for p in results if
                      search_lower in p.name.lower() or
                      search_lower in p.description.lower() or
                      search_lower in p.heading_font.lower() or
                      search_lower in p.body_font.lower() or
                      any(search_lower in tag.lower() for tag in p.tags)]

        return sorted(results, key=lambda x: x.rating, reverse=True)

    def get_by_id(self, pairing_id: int) -> FontPairing | None:
        """Get pairing by ID."""
        return self.pairings.get(pairing_id)

    def vote(self, pairing_id: int, score: int) -> FontPairing | None:
        """Vote for a pairing (1-5 stars)."""
        pairing = self.pairings.get(pairing_id)
        if pairing:
            pairing.add_vote(score)
        return pairing

    def get_styles(self) -> list[str]:
        """Get all available styles."""
        return list(set(p.style for p in self.pairings.values()))

    def get_tags(self) -> list[str]:
        """Get all available tags."""
        all_tags = set()
        for pairing in self.pairings.values():
            all_tags.update(pairing.tags)
        return sorted(list(all_tags))


# Singleton instance
_font_db = None

def get_font_db() -> FontDatabase:
    """Get or create font database instance."""
    global _font_db
    if _font_db is None:
        _font_db = FontDatabase()
    return _font_db
