"""
Typography Agent - Generates typography recommendations
"""
from app.schemas import AIConfigBase
from typing import Dict, Any


class TypographyAgent:
    """Agent responsible for generating typography recommendations"""
    
    def __init__(self, ai_config: AIConfigBase):
        self.ai_config = ai_config
    
    async def generate(self, business_info: dict, brand_context: str = "") -> dict:
        """
        Generate typography based on business info
        
        Returns:
            dict with: heading, body, mono fonts
        """
        # TODO: Implement actual AI call
        return {
            "heading": "Inter",
            "body": "Inter",
            "mono": "JetBrains Mono"
        }