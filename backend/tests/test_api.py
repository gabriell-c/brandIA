import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.main import app
from app.database import get_db


@pytest.mark.asyncio
async def test_health_check(client):
    """Test health check endpoint"""
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_root(client):
    """Test root endpoint"""
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "OmniRoute Design System API" in data["message"]


@pytest.mark.asyncio
async def test_get_projects_empty(client):
    """Test listing projects when empty"""
    response = await client.get("/api/v1/projects/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) == 0


@pytest.mark.asyncio
async def test_create_project(client, db_session: AsyncSession):
    """Test creating a project"""
    project_data = {
        "name": "Test Project",
        "description": "A test project for validation",
        "business_name": "Test Business",
        "business_segment": "Technology",
    }
    
    response = await client.post("/api/v1/projects/", json=project_data)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == project_data["name"]
    assert data["business_name"] == project_data["business_name"]
    assert "id" in data
    assert "created_at" in data


@pytest.mark.asyncio
async def test_get_project_not_found(client):
    """Test getting a non-existent project"""
    response = await client.get("/api/v1/projects/999")
    assert response.status_code == 404
    assert "Project not found" in response.json()["detail"]


@pytest.mark.asyncio
async def test_create_project_missing_fields(client):
    """Test creating a project with missing required fields"""
    project_data = {
        "name": "Test Project",
        # Missing required fields: description, business_name, business_segment
    }
    
    response = await client.post("/api/v1/projects/", json=project_data)
    assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
async def test_update_project(client, db_session: AsyncSession):
    """Test updating a project"""
    # Create project first
    project_data = {
        "name": "Test Project",
        "description": "A test project for validation",
        "business_name": "Test Business",
        "business_segment": "Technology",
    }
    create_response = await client.post("/api/v1/projects/", json=project_data)
    project_id = create_response.json()["id"]
    
    # Update project
    update_data = {"name": "Updated Project"}
    response = await client.put(f"/api/v1/projects/{project_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Project"


@pytest.mark.asyncio
async def test_delete_project(client, db_session: AsyncSession):
    """Test deleting a project"""
    # Create project first
    project_data = {
        "name": "Test Project",
        "description": "A test project for validation",
        "business_name": "Test Business",
        "business_segment": "Technology",
    }
    create_response = await client.post("/api/v1/projects/", json=project_data)
    project_id = create_response.json()["id"]
    
    # Delete project
    response = await client.delete(f"/api/v1/projects/{project_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Project deleted"


@pytest.mark.asyncio
async def test_create_ai_config(client, db_session: AsyncSession):
    """Test creating AI config"""
    ai_config_data = {
        "provider": "openai",
        "api_key": "test-key",
        "model": "gpt-4"
    }
    
    response = await client.post("/api/v1/ai-config/config", json=ai_config_data)
    assert response.status_code == 201
    data = response.json()
    assert data["provider"] == "openai"
    assert "model" in data


@pytest.mark.asyncio
async def test_get_ai_config(client, db_session: AsyncSession):
    """Test getting AI config"""
    # Create config first
    ai_config_data = {
        "provider": "openai",
        "api_key": "test-key",
        "model": "gpt-4"
    }
    create_response = await client.post("/api/v1/ai-config/config", json=ai_config_data)
    data = create_response.json()
    # Config is stored as single row, no ID needed for GET
    config_data = await client.get("/api/v1/ai-config/config")
    assert config_data.status_code == 200
    data = config_data.json()
    assert data["provider"] == "openai"


@pytest.mark.asyncio
async def test_delete_ai_config(client, db_session: AsyncSession):
    """Test deleting AI config"""
    # Create config first
    ai_config_data = {
        "provider": "openai",
        "api_key": "test-key",
        "model": "gpt-4"
    }
    await client.post("/api/v1/ai-config/config", json=ai_config_data)
    
    # Delete config
    response = await client.delete("/api/v1/ai-config/config")
    assert response.status_code == 200
    assert response.json()["message"] == "AI configuration removed"


@pytest.mark.asyncio
async def test_cors(client):
    """Test CORS headers"""
    response = await client.get(
        "/health",
        headers={"Origin": "http://localhost:7000"}
    )
    assert response.status_code == 200
    # CORS headers should be present for allowed origin
    assert "access-control-allow-origin" in response.headers


@pytest.mark.asyncio
async def test_request_logging(client, caplog):
    """Test that requests are logged"""
    with caplog.at_level("INFO"):
        response = await client.get("/health")
        assert response.status_code == 200
        # Check that request was logged
        assert "GET /health" in caplog.text or "GET /health" in str(caplog.records)