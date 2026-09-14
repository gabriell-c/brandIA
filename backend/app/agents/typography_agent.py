"""
Typography agent - generates font pairings using AI.
"""
import json
import logging
from typing import Dict, Any, Optional
from pydantic import BaseModel
from app.ai_client import AIConfig, chat_completion

logger = logging.getLogger(__name__)

TYPOGRAPHY_SYSTEM_PROMPT = """You are an expert typographer with deep knowledge of:
- Font pairing principles (contrast, harmony, hierarchy)
- Google Fonts and web-safe fonts
- Accessibility in typography
- Historical and modern typographic styles

Your task is to select 3 fonts that work harmoniously together for a brand identity.

Font selection criteria:
1. Heading font: Memorable, distinctive, reflects brand personality
2. Body font: Highly readable, versatile, works at small sizes
3. Monospace font: Clean, modern, suitable for code/technical elements

Consider:
- Visual contrast between heading and body
- x-height and readability
- Weight availability (light, regular, medium, bold)
- Language support (Latin, extended Latin, etc.)
- Licensing (prefer open-source fonts)

Provide clear explanations for each selection."""

class TypographyRequest(BaseModel):
    brand_style: str
    industry: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None

class TypographyResponse(BaseModel):
    heading: str
    body: str
    mono: str
    scale: Dict[str, str]
    explanation: str
    preview_css: str

class TypographyAgent:
    """AI agent for generating font pairings."""
    
    def __init__(self, ai_config: AIConfig, rag_context: str = ""):
        self.ai_config = ai_config
        self.rag_context = rag_context
        self.system_prompt = TYPOGRAPHY_SYSTEM_PROMPT
    
    async def generate(self, request: TypographyRequest) -> TypographyResponse:
        """Generate typography system."""
        context = f"Brand style: {request.brand_style}"
        if request.industry:
            context += f"\nIndustry: {request.industry}"
        
        # Add RAG context if available
        rag_context_str = f"\n\nTypography rules to follow:\n{self.rag_context}" if self.rag_context else ""
        
        user_message = f"""Based on the following brand context, select 3 harmonious fonts:

{context}{rag_context_str}

Return ONLY valid JSON in this format:
{{
  "heading": "font name",
  "body": "font name",
  "mono": "font name",
  "scale": {{
    "xs": "0.75rem",
    "sm": "0.875rem",
    "base": "1rem",
    "lg": "1.125rem",
    "xl": "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem"
  }},
  "explanation": "why these fonts were chosen",
  "preview_css": ".font-heading {{ font-family: 'X', sans-serif; }}\\n.font-body {{ font-family: 'Y', sans-serif; }}"
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
            raise Exception(f"Typography generation failed: {response.error}")
        
        try:
            data = json.loads(response.message)
            return TypographyResponse(
                heading=data["heading"],
                body=data["body"],
                mono=data["mono"],
                scale=data["scale"],
                explanation=data["explanation"],
                preview_css=data["preview_css"]
            )
        except (json.JSONDecodeError, KeyError) as e:
            logger.error(f"Invalid typography response: {e}")
            raise Exception(f"Invalid AI response format: {e}")