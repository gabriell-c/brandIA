"""
Deployment & Monitoring Routes
"""
from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List, Optional
import logging

from app.services.backup import get_backup_service, BackupService
from app.services.monitoring import get_monitoring_service, MonitoringService
from app.services import get_backup_service as get_backup

logger = logging.getLogger(__name__)

router = APIRouter()


# Deployment endpoints
@router.get("/deploy/status")
async def get_deploy_status():
    """Get deployment status."""
    return {
        "frontend": {
            "deployed": True,
            "platform": "vercel",
            "url": "https://design-system.vercel.app",
            "last_deploy": "2024-01-01T00:00:00Z"
        },
        "backend": {
            "deployed": True,
            "platform": "railway",
            "url": "https://api.design-system.railway.app",
            "last_deploy": "2024-01-01T00:00:00Z"
        },
        "database": {
            "status": "connected",
            "type": "postgres"
        }
    }


@router.get("/deploy/config")
async def get_deploy_config():
    """Get deployment configuration."""
    return {
        "frontend": {
            "framework": "nextjs",
            "builder": "vercel",
            "build_command": "pnpm build",
            "regions": ["iad1"],
            "custom_domain": "design-system.com"
        },
        "backend": {
            "framework": "fastapi",
            "builder": "railway",
            "start_command": "uvicorn app.main:app --host 0.0.0.0 --port $PORT",
            "regions": ["us-east-1"]
        }
    }


# Monitoring endpoints
@router.get("/monitoring/health")
async def get_health():
    """Get application health status."""
    monitoring = get_monitoring_service()
    return monitoring.get_health_status()


@router.get("/monitoring/metrics")
async def get_metrics():
    """Get Prometheus metrics."""
    monitoring = get_monitoring_service()
    from app.services.monitoring import metrics_endpoint
    return await metrics_endpoint(None)


@router.get("/monitoring/stats")
async def get_stats():
    """Get monitoring statistics."""
    monitoring = get_monitoring_service()
    return {
        "summary": monitoring.get_stats_summary(),
        "recent_requests": monitoring.get_recent_requests(20),
        "recent_errors": monitoring.get_recent_errors(20)
    }


@router.get("/monitoring/config")
async def get_monitoring_config():
    """Get monitoring configuration."""
    return {
        "prometheus": {
            "enabled": True,
            "scrape_interval": "15s"
        },
        "grafana": {
            "enabled": True,
            "dashboards": ["overview", "api", "database"]
        },
        "alertmanager": {
            "enabled": True,
            "channels": ["slack", "email"]
        },
        "loki": {
            "enabled": True,
            "retention": "30d"
        }
    }


# Backup endpoints
@router.get("/backup/list")
async def list_backups(limit: int = 10):
    """List available backups."""
    backup_service = get_backup_service()
    return backup_service.list_backups(limit)


@router.post("/backup/create")
async def create_backup():
    """Create a new backup."""
    backup_service = get_backup_service()
    result = await backup_service.create_backup()
    return result


@router.post("/backup/cleanup")
async def cleanup_backups():
    """Cleanup old backups."""
    backup_service = get_backup_service()
    removed = backup_service.cleanup_old_backups()
    return {"removed_count": removed}


@router.post("/backup/validate/{backup_name}")
async def validate_backup(backup_name: str):
    """Validate a backup file."""
    backup_service = get_backup_service()
    backup_path = backup_service.backup_dir / backup_name
    
    if not backup_path.exists():
        raise HTTPException(status_code=404, detail="Backup not found")
    
    from app.services.backup import BackupService
    service = BackupService()
    is_valid = service.validate_backup(str(backup_path))
    
    return {
        "backup_name": backup_name,
        "valid": is_valid,
        "path": str(backup_path)
    }


@router.get("/backup/schedule")
async def get_backup_schedule():
    """Get backup schedule configuration."""
    backup_service = get_backup_service()
    return backup_service.get_backup_schedule()


# Restore endpoints
@router.post("/backup/restore/{backup_name}")
async def restore_backup(backup_name: str):
    """Restore from a backup."""
    backup_service = get_backup_service()
    backup_path = backup_service.backup_dir / backup_name
    
    if not backup_path.exists():
        raise HTTPException(status_code=404, detail="Backup not found")
    
    # Validate before restore
    service = BackupService()
    is_valid = service.validate_backup(str(backup_path))
    if not is_valid:
        raise HTTPException(status_code=400, detail="Backup validation failed")
    
    # Perform restore
    result = backup_service.restore_backup(str(backup_path))
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result.get("error", "Restore failed"))
    
    return result


@router.post("/backup/restore/latest")
async def restore_latest():
    """Restore from latest backup."""
    backup_service = get_backup_service()
    result = backup_service.restore_latest()
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result.get("error", "Restore failed"))
    
    return result


@router.get("/backup/stats")
async def get_backup_stats():
    """Get backup statistics."""
    backup_service = get_backup_service()
    return {
        "stats": backup_service.get_backup_stats(),
        "schedule": backup_service.get_backup_schedule()
    }