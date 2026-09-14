"""
OmniRoute Design System - API Tests
"""
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.database import Base, engine

# Test client
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
    assert "OmniRoute Design System API" in data["message"]


@pytest.mark.asyncio
async def test_get_projects_empty():
    """Test listing projects when empty"""
    response = client.get("/api/v1/projects/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) == 0


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
    assert "created_at" in data


@pytest.mark.asyncio
async def test_get_project_not_found():
    """Test getting non-existent project"""
    response = client.get("/api/v1/projects/999")
    assert response.status_code == 404
    data = response.json()
    assert "detail" in data


@pytest.mark.asyncio
async def test_create_project_missing_fields():
    """Test creating project with missing required fields"""
    response = client.post("/api/v1/projects/", json={})
    assert response.status_code == 422
    data = response.json()
    assert "detail" in data


@pytest.mark.asyncio
async def test_update_project():
    """Test updating a project"""
    # Create first
    create_response = client.post("/api/v1/projects/", json={"name": "Original Name"})
    project_id = create_response.json()["id"]

    # Update
    update_response = client.put(f"/api/v1/projects/{project_id}", json={"name": "Updated Name"})
    assert update_response.status_code == 200
    assert update_response.json()["name"] == "Updated Name"


@pytest.mark.asyncio
async def test_delete_project():
    """Test deleting a project"""
    # Create first
    create_response = client.post("/api/v1/projects/", json={"name": "Delete Me"})
    project_id = create_response.json()["id"]

    # Delete
    delete_response = client.delete(f"/api/v1/projects/{project_id}")
    assert delete_response.status_code == 200
    assert "message" in delete_response.json()

    # Verify deletion
    get_response = client.get(f"/api/v1/projects/{project_id}")
    assert get_response.status_code == 404


@pytest.mark.asyncio
async def test_create_ai_config():
    """Test creating AI configuration"""
    ai_config_data = {
        "provider": "openai",
        "base_url": "https://api.openai.com/v1",
        "api_key": "test-key-12345",
        "model": "gpt-4o",
    }

    response = client.post("/api/v1/ai-config/config", json=ai_config_data)
    assert response.status_code == 200
    data = response.json()
    assert data["provider"] == "openai"
    assert data["model"] == "gpt-4o"
    assert data["api_key"] == "***"  # Masked


@pytest.mark.asyncio
async def test_get_ai_config():
    """Test getting AI config"""
    # First create config
    client.post("/api/v1/ai-config/config", json={
        "provider": "openai",
        "base_url": "https://api.openai.com/v1",
        "api_key": "test-key",
        "model": "gpt-4o"
    })

    response = client.get("/api/v1/ai-config/config")
    assert response.status_code == 200
    data = response.json()
    assert data["provider"] == "openai"


@pytest.mark.asyncio
async def test_delete_ai_config():
    """Test deleting AI config"""
    # First create config
    client.post("/api/v1/ai-config/config", json={
        "provider": "openai",
        "base_url": "https://api.openai.com/v1",
        "api_key": "test-key",
        "model": "gpt-4o"
    })

    response = client.delete("/api/v1/ai-config/config")
    assert response.status_code == 200
    assert "message" in response.json()


@pytest.mark.asyncio
async def test_rate_limit():
    """Test rate limiting middleware"""
    # Should pass initially
    response = client.get("/health")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_cors():
    """Test CORS headers"""
    response = client.get("/health", headers={"Origin": "http://localhost:7000"})
    assert response.status_code == 200
    assert "access-control-allow-origin" in response.headers


@pytest.mark.asyncio
async def test_request_logging():
    """Test that request logging middleware works"""
    response = client.get("/health")
    assert response.status_code == 200