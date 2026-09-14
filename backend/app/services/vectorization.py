"""
Vectorization service - Convert PNG to SVG using potrace
"""
import os
import base64
import logging
import tempfile
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)


class VectorizationService:
    """Service for converting raster images to SVG vectors."""
    
    def __init__(self):
        self.supported_formats = ['.png', '.jpg', '.jpeg', '.bmp', '.webp']
    
    async def vectorize(self, image_data: bytes, output_format: str = 'svg') -> str:
        """
        Convert raster image to SVG vector.
        
        Args:
            image_data: Raw image bytes
            output_format: Output format (currently only 'svg' supported)
        
        Returns:
            SVG string or error message
        """
        try:
            # Use potrace via command line or implement simple vectorization
            svg_content = await self._process_with_potrace(image_data)
            return svg_content
        except Exception as e:
            logger.error(f"Vectorization failed: {e}")
            return self._generate_placeholder_svg(image_data)
    
    async def _process_with_potrace(self, image_data: bytes) -> str:
        """Process image using potrace algorithm."""
        # Create temporary files
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as input_file:
            input_file.write(image_data)
            input_path = input_file.name
        
        output_path = input_path.replace('.png', '.svg')
        
        try:
            # Try to use potrace
            import subprocess
            result = subprocess.run(
                ['potrace', '--svg', '-o', output_path, input_path],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode == 0 and os.path.exists(output_path):
                with open(output_path, 'r', encoding='utf-8') as f:
                    return f.read()
        except (FileNotFoundError, subprocess.TimeoutExpired):
            # Potrace not available, use fallback
            logger.warning("Potrace not available, using fallback")
        finally:
            # Cleanup
            for path in [input_path, output_path]:
                if os.path.exists(path):
                    os.unlink(path)
        
        # Fallback: generate simple SVG from image data
        return self._generate_placeholder_svg(image_data)
    
    def _generate_placeholder_svg(self, image_data: bytes) -> str:
        """Generate a placeholder SVG when vectorization fails."""
        # Create a simple SVG representation
        svg = '''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <rect width="100" height="100" fill="#f0f0f0" stroke="#ccc" stroke-width="2"/>
  <text x="50" y="55" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#666">
    Vector Preview
  </text>
  <text x="50" y="70" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#999">
    (Vectorization requires potrace)
  </text>
</svg>'''
        return svg
    
    async def optimize_svg(self, svg_content: str) -> str:
        """Optimize SVG for web use."""
        # Basic optimizations
        svg = svg_content.strip()
        
        # Remove unnecessary whitespace
        import re
        svg = re.sub(r'\s+', ' ', svg)
        svg = re.sub(r'\s*([><=/])\s*', r'\1', svg)
        
        return svg


# Singleton instance
_vectorization_service = None

def get_vectorization_service() -> VectorizationService:
    """Get or create vectorization service instance."""
    global _vectorization_service
    if _vectorization_service is None:
        _vectorization_service = VectorizationService()
    return _vectorization_service