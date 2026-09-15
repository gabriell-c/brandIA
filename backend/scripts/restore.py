#!/usr/bin/env python3
"""
Restore script - Restore database from backup
"""
import os
import sys
import sqlite3
import logging
from pathlib import Path
from datetime import datetime
from typing import Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class DatabaseRestoreService:
    """Service for restoring database from backup."""
    
    def __init__(self, backup_dir: str = "./backups"):
        self.backup_dir = Path(backup_dir)
        self.backup_dir.mkdir(parents=True, exist_ok=True)
    
    def list_backups(self) -> list:
        """List available backups."""
        backups = []
        for backup_file in sorted(
            self.backup_dir.glob("backup_*.sqlite"),
            key=lambda x: x.stat().st_mtime,
            reverse=True
        ):
            backups.append({
                "name": backup_file.name,
                "path": str(backup_file),
                "size_bytes": backup_file.stat().st_size,
                "created_at": datetime.fromtimestamp(
                    backup_file.stat().st_mtime
                ).isoformat()
            })
        return backups
    
    def validate_backup(self, backup_path: str) -> tuple:
        """Validate backup file integrity."""
        backup_file = Path(backup_path)
        
        if not backup_file.exists():
            return False, f"Backup file not found: {backup_path}"
        
        if backup_file.stat().st_size == 0:
            return False, "Backup file is empty"
        
        try:
            conn = sqlite3.connect(backup_path)
            cursor = conn.cursor()
            
            # Check if database is valid
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
            tables = cursor.fetchall()
            
            conn.close()
            
            if len(tables) == 0:
                return False, "No tables found in backup"
            
            return True, f"Valid backup with {len(tables)} tables"
            
        except sqlite3.Error as e:
            return False, f"SQLite error: {e}"
        except Exception as e:
            return False, f"Validation error: {e}"
    
    def restore_backup(
        self,
        backup_path: str,
        target_db: str = None
    ) -> dict:
        """Restore database from backup."""
        result = {
            "success": False,
            "backup_name": os.path.basename(backup_path),
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Validate backup first
        is_valid, message = self.validate_backup(backup_path)
        if not is_valid:
            result["error"] = message
            logger.error(f"Backup validation failed: {message}")
            return result
        
        try:
            target_db = target_db or os.environ.get('DATABASE_URL', 'database.sqlite')
            
            # Create backup of current database before restore
            if target_db and Path(target_db).exists():
                current_backup = self.backup_dir / f"pre_restore_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.sqlite"
                import shutil
                shutil.copy2(target_db, current_backup)
                logger.info(f"Created pre-restore backup: {current_backup}")
            
            # Restore from backup
            import shutil
            shutil.copy2(backup_path, target_db)
            
            # Validate restored database
            restored_valid, restored_message = self.validate_backup(target_db)
            if not restored_valid:
                result["error"] = f"Restored database validation failed: {restored_message}"
                logger.error(result["error"])
                return result
            
            result["success"] = True
            result["message"] = f"Database restored successfully: {restored_message}"
            result["target_db"] = target_db
            result["table_count"] = len(sqlite3.connect(target_db).execute(
                "SELECT name FROM sqlite_master WHERE type='table'"
            ).fetchall())
            
            logger.info(f"Restore completed: {result['message']}")
            
        except Exception as e:
            result["error"] = f"Restore failed: {e}"
            logger.error(result["error"], exc_info=True)
        
        return result
    
    def restore_latest(self) -> dict:
        """Restore from the most recent backup."""
        backups = self.list_backups()
        if not backups:
            return {"success": False, "error": "No backups found"}
        
        latest_backup = backups[0]["path"]
        return self.restore_backup(latest_backup)
    
    def get_restore_stats(self) -> dict:
        """Get restore statistics."""
        backups = self.list_backups()
        
        total_size = sum(b["size_bytes"] for b in backups)
        
        return {
            "total_backups": len(backups),
            "total_size_bytes": total_size,
            "total_size_mb": round(total_size / 1024 / 1024, 2),
            "latest_backup": backups[0] if backups else None,
            "latest_restore": None,  # Would be tracked separately
            "estimated_restore_time_seconds": max(1, len(backups) * 0.5)
        }


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Database restore script")
    parser.add_argument("backup", nargs="?", help="Path to backup file")
    parser.add_argument("--target", help="Target database path")
    parser.add_argument("--validate", action="store_true", help="Only validate backup")
    parser.add_argument("--list", action="store_true", help="List available backups")
    
    args = parser.parse_args()
    
    service = DatabaseRestoreService()
    
    if args.list:
        backups = service.list_backups()
        print(f"\nAvailable backups ({len(backups)}):")
        for backup in backups:
            print(f"  - {backup['name']} ({backup['size_bytes'] / 1024:.1f} KB)")
        sys.exit(0)
    
    if args.validate and args.backup:
        is_valid, message = service.validate_backup(args.backup)
        print(f"\nValidation result: {message}")
        sys.exit(0 if is_valid else 1)
    
    if args.backup:
        result = service.restore_backup(args.backup, args.target)
        print(f"\nRestore result: {json.dumps(result, indent=2)}")
        sys.exit(0 if result["success"] else 1)
    else:
        print("\nUsage: python restore.py [backup_file] [--target DB_PATH] [--validate] [--list]")
        print("\nExamples:")
        print("  python restore.py backup_20240101_120000.sqlite")
        print("  python restore.py backup.sqlite --validate")
        print("  python restore.py --list")
        sys.exit(1)