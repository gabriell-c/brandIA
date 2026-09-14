import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from app.main import app
from app.database import Base, init_db
from app.schemas import ProjectCreate, ProjectResponse, BrandingRequest, BrandingResponse

# Test client
client = TestClient(app)

# Test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test-omni-route.db"

engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)
AsyncSessionLocal = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


async def override_get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.mark.asyncio
async def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_root():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "OmniRoute Design System API" in data["message"]


@pytest.mark.asyncio
async def test_create_project():
    """Test creating a project"""
    project_data = {
        "name": "Test Project",
        "description": "A test project for validation",
        "business_name": "Test Business",
        "business_segment": "Technology",
    }

    response = client.post("/api/v1/projects/", json=project_data)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == project_data["name"]
    assert data["business_name"] == project_data["business_name"]
    assert "id" in data


@pytest.mark.asyncio
async def test_get_projects():
    """Test listing projects"""
    response = client.get("/api/v1/projects/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_create_branding_request():
    """Test creating a branding request"""
    branding_data = {
        "project_id": 1,
        "preferences": {
            "style": "modern",
            "mood": "professional",
            "target_audience": "millennials",
        },
    }

    response = client.post("/api/v1/brand/generate", json=branding_data)
    # Should return 200 or 202 (async processing)
    assert response.status_code in [200, 202]


@pytest.mark.asyncio
async def test_create_ai_config():
    """Test creating AI configuration"""
    ai_config_data = {
        "provider": "openai",
        "base_url": "https://api.openai.com/v1",
        "api_key": "test-key",
        "model": "gpt-4o",
    }

    response = client.post("/api/v1/ai-config/config", json=ai_config_data)
    assert response.status_code == 200
    data = response.json()
    assert data["provider"] == "openai"
    assert data["model"] == "gpt-4o"


@pytest.mark.asyncio
async def test_validation_error():
    """Test validation error handling"""
    response = client.post(
        "/api/v1/projects/", json={"invalid_field": "value"}
    )
    assert response.status_code == 422
    data = response.json()
    assert "detail" in data
