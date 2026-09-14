from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import Request, HTTPException
import json
import logging
from logging.handlers import RotatingFileHandler
import time

from app.routes import projects, brand, ai_config
from app.database import engine, Base, init_db

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        RotatingFileHandler('app.log', maxBytes=10_000_000, backupCount=5),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

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

# Rate limiting middleware
_rate_limit_store: dict = {}
RATE_LIMIT = 100  # requests per minute


@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    """Rate limiting middleware - 100 requests per minute per IP"""
    client_ip = request.client.host
    current_time = time.time()
    
    # Clean old entries
    if client_ip in _rate_limit_store:
        _rate_limit_store[client_ip] = [
            t for t in _rate_limit_store[client_ip] if current_time - t < 60
        ]
    else:
        _rate_limit_store[client_ip] = []
    
    # Check rate limit
    if len(_rate_limit_store[client_ip]) >= RATE_LIMIT:
        return JSONResponse(
            status_code=429,
            content={"detail": "Rate limit exceeded. Try again in a minute."}
        )
    
    # Add current request timestamp
    _rate_limit_store[client_ip].append(current_time)
    
    return await call_next(request)


# Request logging middleware
@app.middleware("http")
async def log_requests_middleware(request: Request, call_next):
    """Log all requests with timing"""
    start_time = time.time()
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    logger.info(
        f"{request.method} {request.url.path} - Status: {response.status_code} - Time: {process_time:.3f}s"
    )
    
    return response


# Exception handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions with structured error response"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "type": "http_error",
            "status_code": exc.status_code
        }
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "type": "internal_error",
            "status_code": 500
        }
    )


# Routers
app.include_router(projects.router, prefix="/api/v1/projects", tags=["projects"])
app.include_router(brand.router, prefix="/api/v1/brand", tags=["brand"])
app.include_router(ai_config.router, prefix="/api/v1/ai-config", tags=["ai-config"])


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    await init_db()
    logger.info("Application started")


@app.get("/")
async def root():
    return {"message": "OmniRoute Design System API"}


@app.get("/health")
async def health():
    return {"status": "ok"}