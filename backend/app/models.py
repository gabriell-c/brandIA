from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    business_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    business_segment: Mapped[str | None] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    brands: Mapped[list["Brand"]] = relationship("Brand", back_populates="project", cascade="all, delete-orphan")


class Brand(Base):
    __tablename__ = "brands"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    project_id: Mapped[int] = mapped_column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    business_name: Mapped[str | None] = mapped_column(String(255))
    segment: Mapped[str | None] = mapped_column(String(100))
    tone_of_voice: Mapped[str | None] = mapped_column(String(50))
    palette: Mapped[str | None] = mapped_column("palette", nullable=True)  # JSON
    typography: Mapped[str | None] = mapped_column("typography", nullable=True)  # JSON
    logo_svg: Mapped[str | None] = mapped_column("logo_svg", nullable=True)  # SVG string
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # Relationships
    project: Mapped["Project"] = relationship("Project", back_populates="brands")
    design_systems: Mapped[list["DesignSystem"]] = relationship("DesignSystem", back_populates="brand", cascade="all, delete-orphan")


class DesignSystem(Base):
    __tablename__ = "design_systems"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    brand_id: Mapped[int] = mapped_column(Integer, ForeignKey("brands.id", ondelete="CASCADE"), nullable=False, index=True)
    tokens: Mapped[str | None] = mapped_column("tokens", nullable=True)  # JSON
    components: Mapped[str | None] = mapped_column("components", nullable=True)  # JSON
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # Relationships
    brand: Mapped["Brand"] = relationship("Brand", back_populates="design_systems")


class AIConfig(Base):
    __tablename__ = "ai_configs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    provider: Mapped[str] = mapped_column(String(50), nullable=False, default="openai")
    base_url: Mapped[str] = mapped_column(String(500), nullable=False)
    api_key: Mapped[str] = mapped_column(Text, nullable=False)  # Encrypted
    model: Mapped[str] = mapped_column(String(100), nullable=False, default="gpt-4o")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
