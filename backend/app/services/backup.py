"""
Backup service - Automated database backups with scheduling
"""
import os
import json
import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Any, Optional, List
import subprocess
import sqlite3
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)


class BackupService:
    """Service for automated database backups."""
    
    def __init__(
        self,
        backup_dir: str = "./backups",
        retention_days: int = 30,
        schedule_cron: str = "0 2 * * *"  # Daily at 2 AM
    ):
        self.backup_dir = Path(backup_dir)
        self.retention_days = retention_days
        self.schedule_cron = schedule_cron
        self.backup_dir.mkdir(parents=True, exist_ok=True)
    
    async def create_backup(
        self,
        db_path: str = None,
        backup_name: str = None
    ) -> Dict[str, Any]:
        """Create a database backup."""
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        backup_filename = backup_name or f"backup_{timestamp}.sqlite"
        backup_path = self.backup_dir / backup_filename
        
        try:
            # Create backup
            if db_path:
                # SQLite backup
                import shutil
                shutil.copy2(db_path, backup_path)
            else:
                # PostgreSQL backup using pg_dump
                result = subprocess.run(
                    ['pg_dump', os.environ.get('DATABASE_URL', '')],
                    capture_output=True,
                    text=True,
                    timeout=300
                )
                if result.returncode == 0:
                    backup_path.write_text(result.stdout)
            
            backup_size = backup_path.stat().st_size if backup_path.exists() else 0
            
            return {
                "success": True,
                "backup_path": str(backup_path),
                "backup_name": backup_filename,
                "timestamp": timestamp,
                "size_bytes": backup_size,
                "size_mb": round(backup_size / 1024 / 1024, 2)
            }
            
        except Exception as e:
            logger.error(f"Backup failed: {e}")
            return {
                "success": False,
                "error": str(e),
                "timestamp": timestamp
            }
    
    def cleanup_old_backups(self) -> int:
        """Remove backups older than retention period."""
        cutoff_date = datetime.utcnow() - timedelta(days=self.retention_days)
        removed_count = 0
        
        for backup_file in self.backup_dir.glob("backup_*.sqlite"):
            if backup_file.stat().st_mtime < cutoff_date.timestamp():
                backup_file.unlink()
                removed_count += 1
                logger.info(f"Removed old backup: {backup_file.name}")
        
        return removed_count
    
    def list_backups(self, limit: int = 10) -> List[Dict[str, Any]]:
        """List available backups."""
        backups = []
        
        for backup_file in sorted(
            self.backup_dir.glob("backup_*.sqlite"),
            key=lambda x: x.stat().st_mtime,
            reverse=True
        )[:limit]:
            backups.append({
                "name": backup_file.name,
                "path": str(backup_file),
                "size_bytes": backup_file.stat().st_size,
                "size_mb": round(backup_file.stat().st_size / 1024 / 1024, 2),
                "created_at": datetime.fromtimestamp(
                    backup_file.stat().st_mtime
                ).isoformat()
            })
        
        return backups
    
    def validate_backup(self, backup_path: str) -> bool:
        """Validate backup integrity."""
        try:
            backup_file = Path(backup_path)
            if not backup_file.exists():
                return False
            
            # Check file size
            if backup_file.stat().st_size == 0:
                return False
            
            # For SQLite, try to open the database
            if backup_path.endswith('.sqlite'):
                conn = sqlite3.connect(backup_path)
                cursor = conn.cursor()
                cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
                tables = cursor.fetchall()
                conn.close()
                return len(tables) > 0
            
            return True
            
        except Exception as e:
            logger.error(f"Backup validation failed: {e}")
            return False
    
    def get_backup_schedule(self) -> Dict[str, Any]:
        """Get backup schedule configuration."""
        return {
            "schedule_cron": self.schedule_cron,
            "retention_days": self.retention_days,
            "backup_dir": str(self.backup_dir),
            "last_cleanup": None,  # Would be updated after cleanup
            "next_run": self._calculate_next_run()
        }
    
    def _calculate_next_run(self) -> str:
        """Calculate next scheduled run time."""
        # Simplified - in production use a proper scheduler like APScheduler
        now = datetime.utcnow()
        next_run = now.replace(hour=2, minute=0, second=0, microsecond=0)
        if next_run < now:
            next_run += timedelta(days=1)
        return next_run.isoformat()


# Singleton
_backup_service = None

def get_backup_service() -> BackupService:
    global _backup_service
    if _backup_service is None:
        _backup_service = BackupService()
    return _backup_service