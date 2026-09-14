from sqlalchemy import String, Integer, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from typing import Optional
from datetime import datetime
from app.database import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())


class Brand(Base):
    __tablename__ = "brands"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    project_id: Mapped[int] = mapped_column(Integer, nullable=False)
    business_name: Mapped[Optional[str]] = mapped_column(String(255))
    segment: Mapped[Optional[str]] = mapped_column(String(100))
    tone_of_voice: Mapped[Optional[str]] = mapped_column(String(50))
    palette: Mapped[Optional[str]] = mapped_column("palette", nullable=True)  # JSON
    typography: Mapped[Optional[str]] = mapped_column("typography", nullable=True)  # JSON
    logo_svg: Mapped[Optional[str]] = mapped_column("logo_svg", nullable=True)  # SVG string
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class DesignSystem(Base):
    __tablename__ = "design_systems"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    brand_id: Mapped[int] = mapped_column(Integer, nullable=False)
    tokens: Mapped[Optional[str]] = mapped_column("tokens", nullable=True)  # JSON
    components: Mapped[Optional[str]] = mapped_column("components", nullable=True)  # JSON
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())