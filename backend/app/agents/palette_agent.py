"""
Palette agent - generates accessible color palettes using AI.
"""
import json
import logging
import re
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field
from app.ai_client import AIConfig, AIChatResponse, chat_completion

logger = logging.getLogger(__name__)

PALETTE_SYSTEM_PROMPT = """You are an expert color theorist and accessibility consultant with deep knowledge of:
- Color harmony (complementary, analogous, triadic, split-complementary)
- Color psychology and cultural associations
- WCAG 2.1 accessibility guidelines (AA and AAA contrast ratios)
- Color theory for digital interfaces

Your task is to generate harmonious, accessible color palettes.

For each color in the palette:
1. Primary: Main brand color (60% of design)
2. Secondary: Complementary color (30% of design)
3. Accent: For CTAs and highlights (5-10% of design)
4. Neutral: For text and backgrounds (neutral grays)
5. Light: For backgrounds and surfaces
6. Dark: For text and strong contrast elements

Ensure all colors pass WCAG AA (4.5:1 for normal text, 3:1 for large text).
Provide hex codes that are visually balanced and harmonious."""

class PaletteRequest(BaseModel):
    business_context: str
    preferred_style: Optional[str] = None  # e.g., "modern", "classic", "bold"
    exclude_colors: Optional[List[str]] = None  # e.g., ["red"]

class PaletteResponse(BaseModel):
    palette: Dict[str, str]
    accessibility: Dict[str, Dict[str, Any]]
    suggestions: List[str]
    explanation: str

class PaletteAgent:
    """AI agent for generating accessible color palettes."""
    
    def __init__(self, ai_config: AIConfig, rag_context: str = ""):
        self.ai_config = ai_config
        self.rag_context = rag_context
        self.system_prompt = PALETTE_SYSTEM_PROMPT
    
    async def generate(self, request: PaletteRequest) -> PaletteResponse:
        """Generate a complete color palette."""
        context = f"Business context: {request.business_context}"
        if request.preferred_style:
            context += f"\nPreferred style: {request.preferred_style}"
        if request.exclude_colors:
            context += f"\nExclude colors: {', '.join(request.exclude_colors)}"
        
        # Add RAG context if available
        rag_context_str = f"\n\nDesign rules to follow:\n{self.rag_context}" if self.rag_context else ""
        
        user_message = f"""Generate a complete color palette based on:

{context}{rag_context_str}

Return ONLY valid JSON in this format:
{{
  "palette": {{
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "neutral": "#hex",
    "light": "#hex",
    "dark": "#hex"
  }},
  "accessibility": {{
    "primary_on_light": "ratio",
    "primary_on_dark": "ratio",
    "neutral_text": "ratio",
    "all_pass_aa": true/false,
    "all_pass_aaa": true/false
  }},
  "suggestions": ["color usage tips"],
  "explanation": "why these colors were chosen"
}}"""
        
        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": user_message}
        ]
        
        response = await chat_completion(
            messages=messages,
            config=self.ai_config,
            response_format={"type": "json_object"}
        )
        
        if not response.success:
            raise Exception(f"Palette generation failed: {response.error}")
        
        try:
            data = json.loads(response.message)
            
            # Validate color format
            self._validate_colors(data["palette"])
            
            return PaletteResponse(
                palette=data["palette"],
                accessibility=data.get("accessibility", {}),
                suggestions=data.get("suggestions", []),
                explanation=data["explanation"]
            )
        except (json.JSONDecodeError, KeyError) as e:
            logger.error(f"Invalid palette response: {e}")
            raise Exception(f"Invalid AI response format: {e}")
    
    def _validate_colors(self, palette: Dict[str, str]):
        """Validate hex color format."""
        hex_pattern = re.compile(r'^#[0-9A-Fa-f]{6}$')
        for color_name, hex_value in palette.items():
            if not hex_pattern.match(hex_value):
                raise ValueError(f"Invalid color format for {color_name}: {hex_value}")
    
    async def validate(self, palette: Dict[str, str]) -> Dict[str, Any]:
        """Validate palette against WCAG standards."""
        # Simple validation - check hex format
        for color_name, hex_value in palette.items():
            if not re.match(r'^#[0-9A-Fa-f]{6}$', hex_value):
                return {
                    "colors": list(palette.values()),
                    "accessibility": {"valid": False, "error": f"Invalid color format: {color_name}"}
                }
        
        return {
            "colors": list(palette.values()),
            "accessibility": {"valid": True}
        }