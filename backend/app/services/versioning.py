"""
Versioning service - Multiple versions, diff, rollback for branding projects
"""
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime
import uuid
import json

logger = logging.getLogger(__name__)


class DesignVersion:
    """Represents a version of a design/project."""
    
    def __init__(
        self,
        id: str,
        project_id: str,
        brand_id: str,
        name: str,
        description: str,
        palette: Dict[str, str],
        typography: Dict[str, str],
        logo_svg: str = None,
        notes: str = None,
        created_by: str = None,
        created_at: datetime = None
    ):
        self.id = id
        self.project_id = project_id
        self.brand_id = brand_id
        self.name = name
        self.description = description
        self.palette = palette
        self.typography = typography
        self.logo_svg = logo_svg
        self.notes = notes
        self.created_by = created_by
        self.created_at = created_at or datetime.utcnow()
        self.is_current = False
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "project_id": self.project_id,
            "brand_id": self.brand_id,
            "name": self.name,
            "description": self.description,
            "palette": self.palette,
            "typography": self.typography,
            "logo_svg": self.logo_svg,
            "notes": self.notes,
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat(),
            "is_current": self.is_current
        }
    
    def get_diff(self, other: 'DesignVersion') -> Dict[str, Any]:
        """Calculate differences between this version and another."""
        diff = {
            "palette_changes": [],
            "typography_changes": [],
            "logo_changed": False
        }
        
        # Compare palettes
        for color_name, color_value in self.palette.items():
            other_value = other.palette.get(color_name)
            if other_value and color_value != other_value:
                diff["palette_changes"].append({
                    "color": color_name,
                    "old_value": color_value,
                    "new_value": other_value
                })
        
        # Compare typography
        for font_type, font_value in self.typography.items():
            other_value = other.typography.get(font_type)
            if other_value and font_value != other_value:
                diff["typography_changes"].append({
                    "type": font_type,
                    "old_value": font_value,
                    "new_value": other_value
                })
        
        # Compare logos
        if self.logo_svg != other.logo_svg:
            diff["logo_changed"] = True
        
        return diff


class VersionService:
    """Service for managing design versions."""
    
    def __init__(self):
        self.versions: Dict[str, DesignVersion] = {}
        self.project_versions: Dict[str, List[str]] = {}  # project_id -> [version_ids]
    
    def create_version(
        self,
        project_id: str,
        brand_id: str,
        name: str,
        palette: Dict[str, str],
        typography: Dict[str, str],
        logo_svg: str = None,
        notes: str = None,
        created_by: str = None
    ) -> DesignVersion:
        """Create a new version of a design."""
        # Deactivate current version if exists
        for vid in self.project_versions.get(project_id, []):
            version = self.versions.get(vid)
            if version and version.is_current:
                version.is_current = False
        
        # Create new version
        version_id = str(uuid.uuid4())[:8]
        version = DesignVersion(
            id=version_id,
            project_id=project_id,
            brand_id=brand_id,
            name=name,
            description="",
            palette=palette,
            typography=typography,
            logo_svg=logo_svg,
            notes=notes,
            created_by=created_by
        )
        version.is_current = True
        
        self.versions[version_id] = version
        self.project_versions.setdefault(project_id, []).append(version_id)
        
        logger.info(f"Created version {version_id} for project {project_id}")
        return version
    
    def get_version(self, version_id: str) -> Optional[DesignVersion]:
        """Get a specific version."""
        return self.versions.get(version_id)
    
    def get_project_versions(
        self,
        project_id: str,
        limit: int = 50
    ) -> List[DesignVersion]:
        """Get all versions for a project, sorted by date."""
        version_ids = self.project_versions.get(project_id, [])
        versions = [self.versions[vid] for vid in version_ids if self.versions.get(vid)]
        return sorted(versions, key=lambda x: x.created_at, reverse=True)[:limit]
    
    def get_current_version(self, project_id: str) -> Optional[DesignVersion]:
        """Get the current active version."""
        for vid in self.project_versions.get(project_id, []):
            version = self.versions.get(vid)
            if version and version.is_current:
                return version
        return None
    
    def create_diff(
        self,
        version1_id: str,
        version2_id: str
    ) -> Optional[Dict[str, Any]]:
        """Create a diff between two versions."""
        version1 = self.versions.get(version1_id)
        version2 = self.versions.get(version2_id)
        
        if not version1 or not version2:
            return None
        
        diff = version1.get_diff(version2)
        diff["version1"] = version1.to_dict()
        diff["version2"] = version2.to_dict()
        diff["version1_name"] = version1.name
        diff["version2_name"] = version2.name
        diff["version1_created_at"] = version1.created_at.isoformat()
        diff["version2_created_at"] = version2.created_at.isoformat()
        
        return diff
    
    def rollback_to_version(
        self,
        project_id: str,
        version_id: str,
        new_name: str = None
    ) -> Optional[DesignVersion]:
        """Rollback to a previous version by creating a new version."""
        target_version = self.versions.get(version_id)
        if not target_version:
            return None
        
        # Create new version with target version's data
        current_version = self.get_current_version(project_id)
        name = new_name or f"Rollback to {target_version.name}"
        
        return self.create_version(
            project_id=project_id,
            brand_id=target_version.brand_id,
            name=name,
            palette=target_version.palette.copy(),
            typography=target_version.typography.copy(),
            logo_svg=target_version.logo_svg,
            notes=f"Rolled back from {current_version.name} to {target_version.name}" if current_version else None,
            created_by=target_version.created_by
        )
    
    def delete_version(self, version_id: str) -> bool:
        """Delete a version (not the current one)."""
        version = self.versions.get(version_id)
        if not version or version.is_current:
            return False
        
        # Remove from project versions
        if version.project_id in self.project_versions:
            self.project_versions[version.project_id].remove(version_id)
        
        del self.versions[version_id]
        return True
    
    def get_version_history(self, project_id: str) -> List[Dict[str, Any]]:
        """Get version history with summary info."""
        versions = self.get_project_versions(project_id)
        history = []
        
        for i, version in enumerate(versions):
            history.append({
                "id": version.id,
                "name": version.name,
                "description": version.description,
                "notes": version.notes,
                "created_at": version.created_at.isoformat(),
                "is_current": version.is_current,
                "changes": {
                    "palette_count": len(version.palette),
                    "typography_count": len(version.typography),
                    "has_logo": version.logo_svg is not None
                }
            })
        
        return history
    
    def get_changes_count(self, project_id: str) -> int:
        """Get the number of changes made to a project."""
        return len(self.project_versions.get(project_id, []))


# Singleton
_versioning_service = None

def get_versioning_service() -> VersionService:
    global _versioning_service
    if _versioning_service is None:
        _versioning_service = VersionService()
    return _versioning_service