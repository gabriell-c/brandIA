from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio

from app.routes import projects, brand, ai_config
from app.database import engine, Base, init_db

# Create FastAPI app
app = FastAPI(
    title="OmniRoute Design System API",
    description="Open source branding & design system tool with AI",
    version="0.1.0",
)

# CORS - permitir apenas localhost do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:7000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(projects.router, prefix="/api/v1/projects", tags=["projects"])
app.include_router(brand.router, prefix="/api/v1/brand", tags=["brand"])
app.include_router(ai_config.router, prefix="/api/v1/ai-config", tags=["ai-config"])


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    await init_db()


@app.get("/")
async def root():
    return {"message": "OmniRoute Design System API"}


@app.get("/health")
async def health():
    return {"status": "ok"}