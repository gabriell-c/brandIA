"""
Marketplace service - Premium templates marketplace with Stripe integration
"""
import logging
import uuid
from datetime import datetime
from enum import Enum
from typing import Any

logger = logging.getLogger(__name__)


class LicenseType(str, Enum):
    PERSONAL = "personal"
    COMMERCIAL = "commercial"
    EXTENDED = "extended"


class TemplateStatus(str, Enum):
    DRAFT = "draft"
    PENDING_REVIEW = "pending_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    ACTIVE = "active"
    INACTIVE = "inactive"


class MarketplaceTemplate:
    """Represents a marketplace template."""

    def __init__(
        self,
        id: str,
        name: str,
        description: str,
        segment: str,
        palette: dict[str, str],
        typography: dict[str, str],
        preview_images: list[str],
        author_id: str,
        author_name: str,
        price_cents: int,
        license_type: LicenseType = LicenseType.COMMERCIAL,
        tags: list[str] = None,
        status: TemplateStatus = TemplateStatus.DRAFT,
        created_at: datetime = None,
        updated_at: datetime = None
    ):
        self.id = id
        self.name = name
        self.description = description
        self.segment = segment
        self.palette = palette
        self.typography = typography
        self.preview_images = preview_images
        self.author_id = author_id
        self.author_name = author_name
        self.price_cents = price_cents
        self.license_type = license_type
        self.tags = tags or []
        self.status = status
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()
        self.sales_count = 0
        self.revenue_cents = 0

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "segment": self.segment,
            "palette": self.palette,
            "typography": self.typography,
            "preview_images": self.preview_images,
            "author_id": self.author_id,
            "author_name": self.author_name,
            "price_cents": self.price_cents,
            "price_dollars": self.price_cents / 100,
            "license_type": self.license_type.value,
            "tags": self.tags,
            "status": self.status.value,
            "sales_count": self.sales_count,
            "revenue_cents": self.revenue_cents,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }


class Purchase:
    """Represents a template purchase."""

    def __init__(
        self,
        id: str,
        template_id: str,
        buyer_id: str,
        buyer_email: str,
        amount_cents: int,
        license_type: LicenseType,
        stripe_session_id: str = None,
        stripe_payment_intent_id: str = None,
        status: str = "pending",
        created_at: datetime = None
    ):
        self.id = id
        self.template_id = template_id
        self.buyer_id = buyer_id
        self.buyer_email = buyer_email
        self.amount_cents = amount_cents
        self.license_type = license_type
        self.stripe_session_id = stripe_session_id
        self.stripe_payment_intent_id = stripe_payment_intent_id
        self.status = status
        self.created_at = created_at or datetime.utcnow()
        self.completed_at = None

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "template_id": self.template_id,
            "buyer_id": self.buyer_id,
            "buyer_email": self.buyer_email,
            "amount_cents": self.amount_cents,
            "amount_dollars": self.amount_cents / 100,
            "license_type": self.license_type.value,
            "stripe_session_id": self.stripe_session_id,
            "stripe_payment_intent_id": self.stripe_payment_intent_id,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "completed_at": self.completed_at.isoformat() if self.completed_at else None
        }

    def mark_completed(self, payment_intent_id: str = None):
        self.status = "completed"
        self.completed_at = datetime.utcnow()
        if payment_intent_id:
            self.stripe_payment_intent_id = payment_intent_id


class MarketplaceService:
    """Service for marketplace operations."""

    def __init__(self):
        self.templates: dict[str, MarketplaceTemplate] = {}
        self.purchases: dict[str, Purchase] = {}
        self._init_sample_templates()

    def _init_sample_templates(self):
        """Initialize with sample premium templates."""
        samples = [
            {
                "name": "SaaS Landing Pro",
                "description": "Professional SaaS landing page with pricing, features, and testimonials",
                "segment": "saas",
                "palette": {
                    "primary": "#3B82F6", "secondary": "#10B981", "accent": "#F59E0B",
                    "neutral": "#6B7280", "light": "#F3F4F6", "dark": "#111827"
                },
                "typography": {
                    "heading": "Inter", "body": "Inter", "mono": "JetBrains Mono"
                },
                "preview_images": ["/templates/saas-landing-1.jpg", "/templates/saas-landing-2.jpg"],
                "author_name": "DesignStudio",
                "price_cents": 4900,
                "license_type": LicenseType.COMMERCIAL,
                "tags": ["saas", "landing", "conversion", "modern"]
            },
            {
                "name": "E-commerce Complete",
                "description": "Full e-commerce template with product pages, cart, and checkout",
                "segment": "ecommerce",
                "palette": {
                    "primary": "#F97316", "secondary": "#06B6D4", "accent": "#84CC16",
                    "neutral": "#4B5563", "light": "#FFF7ED", "dark": "#1F2937"
                },
                "typography": {
                    "heading": "Montserrat", "body": "Open Sans", "mono": "Roboto Mono"
                },
                "preview_images": ["/templates/ecommerce-1.jpg", "/templates/ecommerce-2.jpg"],
                "author_name": "ShopDesign",
                "price_cents": 7900,
                "license_type": LicenseType.COMMERCIAL,
                "tags": ["ecommerce", "shop", "cart", "checkout"]
            },
            {
                "name": "Portfolio Pro",
                "description": "Creative portfolio with case studies, project galleries, and contact forms",
                "segment": "creative",
                "palette": {
                    "primary": "#EC4899", "secondary": "#8B5CF6", "accent": "#F59E0B",
                    "neutral": "#6B7280", "light": "#FDF2F8", "dark": "#1F2937"
                },
                "typography": {
                    "heading": "Playfair Display", "body": "Inter", "mono": "Fira Code"
                },
                "preview_images": ["/templates/portfolio-1.jpg", "/templates/portfolio-2.jpg"],
                "author_name": "CreativeAgency",
                "price_cents": 3900,
                "license_type": LicenseType.PERSONAL,
                "tags": ["portfolio", "creative", "gallery", "showcase"]
            }
        ]

        for sample in samples:
            self.create_template(
                name=sample["name"],
                description=sample["description"],
                segment=sample["segment"],
                palette=sample["palette"],
                typography=sample["typography"],
                preview_images=sample["preview_images"],
                author_id="system",
                author_name=sample["author_name"],
                price_cents=sample["price_cents"],
                license_type=sample["license_type"],
                tags=sample["tags"]
            )

    def create_template(
        self,
        name: str,
        description: str,
        segment: str,
        palette: dict[str, str],
        typography: dict[str, str],
        preview_images: list[str],
        author_id: str,
        author_name: str,
        price_cents: int,
        license_type: LicenseType = LicenseType.COMMERCIAL,
        tags: list[str] = None
    ) -> MarketplaceTemplate:
        """Create a new marketplace template."""
        template = MarketplaceTemplate(
            id=str(uuid.uuid4())[:8],
            name=name,
            description=description,
            segment=segment,
            palette=palette,
            typography=typography,
            preview_images=preview_images,
            author_id=author_id,
            author_name=author_name,
            price_cents=price_cents,
            license_type=license_type,
            tags=tags or [],
            status=TemplateStatus.DRAFT
        )
        self.templates[template.id] = template
        return template

    def get_template(self, template_id: str) -> MarketplaceTemplate | None:
        return self.templates.get(template_id)

    def list_templates(
        self,
        status: TemplateStatus = None,
        segment: str = None,
        tags: list[str] = None,
        min_price: int = None,
        max_price: int = None,
        search: str = None
    ) -> list[MarketplaceTemplate]:
        results = list(self.templates.values())

        if status:
            results = [t for t in results if t.status == status]

        if segment:
            results = [t for t in results if t.segment == segment]

        if tags:
            results = [t for t in results if any(tag in t.tags for tag in tags)]

        if min_price is not None:
            results = [t for t in results if t.price_cents >= min_price]

        if max_price is not None:
            results = [t for t in results if t.price_cents <= max_price]

        if search:
            search_lower = search.lower()
            results = [t for t in results if
                      search_lower in t.name.lower() or
                      search_lower in t.description.lower() or
                      search_lower in t.segment.lower() or
                      any(search_lower in tag.lower() for tag in t.tags)]

        return sorted(results, key=lambda x: x.created_at, reverse=True)

    def get_active_templates(self) -> list[MarketplaceTemplate]:
        return [t for t in self.templates.values() if t.status == TemplateStatus.ACTIVE]

    def submit_for_review(self, template_id: str) -> MarketplaceTemplate | None:
        template = self.templates.get(template_id)
        if template:
            template.status = TemplateStatus.PENDING_REVIEW
            template.updated_at = datetime.utcnow()
        return template

    def approve_template(self, template_id: str) -> MarketplaceTemplate | None:
        template = self.templates.get(template_id)
        if template:
            template.status = TemplateStatus.APPROVED
            template.updated_at = datetime.utcnow()
        return template

    def activate_template(self, template_id: str) -> MarketplaceTemplate | None:
        template = self.templates.get(template_id)
        if template:
            template.status = TemplateStatus.ACTIVE
            template.updated_at = datetime.utcnow()
        return template

    def create_purchase(
        self,
        template_id: str,
        buyer_id: str,
        buyer_email: str,
        license_type: LicenseType,
        stripe_session_id: str = None
    ) -> Purchase | None:
        template = self.templates.get(template_id)
        if not template:
            return None

        purchase = Purchase(
            id=str(uuid.uuid4())[:8],
            template_id=template_id,
            buyer_id=buyer_id,
            buyer_email=buyer_email,
            amount_cents=template.price_cents,
            license_type=license_type,
            stripe_session_id=stripe_session_id
        )
        self.purchases[purchase.id] = purchase
        return purchase

    def complete_purchase(self, purchase_id: str, payment_intent_id: str = None) -> Purchase | None:
        purchase = self.purchases.get(purchase_id)
        if purchase:
            purchase.mark_completed(payment_intent_id)
            # Update template stats
            template = self.templates.get(purchase.template_id)
            if template:
                template.sales_count += 1
                template.revenue_cents += purchase.amount_cents
        return purchase

    def get_user_purchases(self, user_id: str) -> list[Purchase]:
        return [p for p in self.purchases.values() if p.buyer_id == user_id]

    def has_purchased(self, user_id: str, template_id: str) -> bool:
        purchases = self.get_user_purchases(user_id)
        return any(p.template_id == template_id and p.status == "completed" for p in purchases)

    def create_stripe_checkout_session(self, template_id: str, buyer_email: str, success_url: str, cancel_url: str) -> dict[str, Any]:
        """Create a Stripe checkout session (mock implementation)."""
        template = self.templates.get(template_id)
        if not template:
            raise ValueError("Template not found")

        # In production, integrate with Stripe API
        # For now, return a mock session
        session_id = f"cs_mock_{uuid.uuid4().hex[:16]}"

        return {
            "session_id": session_id,
            "url": f"https://checkout.stripe.com/pay/{session_id}?mock=true",
            "template": template.to_dict(),
            "amount_cents": template.price_cents
        }

    def get_segments(self) -> list[str]:
        return list(set(t.segment for t in self.templates.values()))

    def get_tags(self) -> list[str]:
        all_tags = set()
        for template in self.templates.values():
            all_tags.update(template.tags)
        return sorted(list(all_tags))


# Singleton
_marketplace = None

def get_marketplace() -> MarketplaceService:
    global _marketplace
    if _marketplace is None:
        _marketplace = MarketplaceService()
    return _marketplace
