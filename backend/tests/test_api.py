"""
OmniRoute Design System - API Tests
"""
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.database import Base, engine, AsyncSessionLocal

client = TestClient(app)


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


@pytest.mark.asyncio
async def test_get_projects_empty():
    """Test listing projects when empty"""
    response = client.get("/api/v1/projects/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_create_project():
    """Test creating a project"""
    project_data = {
        "name": "Test Project",
        "description": "A test project",
        "business_name": "Test Business",
        "business_segment": "Technology",
    }
    response = client.post("/api/v1/projects/", json=project_data)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == project_data["name"]
    assert "id" in data


@pytest.mark.asyncio
async def test_create_project_missing_fields():
    """Test creating project with missing fields"""
    response = client.post("/api/v1/projects/", json={})
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_project_not_found():
    """Test getting non-existent project"""
    response = client.get("/api/v1/projects/999")
    assert response.status_code == 404


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
    assert response.status_code in [200, 201]


@pytest.mark.asyncio
async def test_get_ai_config():
    """Test getting AI config"""
    response = client.get("/api/v1/ai-config")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_delete_ai_config():
    """Test deleting AI config"""
    response = client.delete("/api/v1/ai-config")
    assert response.status_code == 200
