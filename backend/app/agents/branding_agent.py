"""
Branding agent - generates complete branding proposals using AI.
"""
import json
import logging

from pydantic import BaseModel

from app.ai_client import AIConfig, chat_completion

logger = logging.getLogger(__name__)

# System prompt for branding generation
BRANDING_SYSTEM_PROMPT = """You are an expert brand strategist and visual identity designer with 20+ years of experience. 
Your task is to create a complete branding proposal based on business information.

When generating a brand identity, consider:
1. Business name - memorable, relevant, and market-appropriate
2. Tagline - concise, memorable, and reflects brand personality
3. Color palette - 6 colors that work harmoniously, considering:
   - Primary color (main brand color)
   - Secondary color (complementary)
   - Accent color (for CTAs and highlights)
   - Neutral colors (backgrounds, text)
   - Ensure WCAG AA contrast compliance
4. Typography - 3 fonts that create visual hierarchy:
   - Heading font (bold, memorable)
   - Body font (readable, versatile)
   - Monospace font (for code/technical elements)
5. Explanation - detailed reasoning for each choice

Return your response as a JSON object with this exact structure:
{
  "brand_name": "string",
  "tagline": "string",
  "palette": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "neutral": "#hex",
    "light": "#hex",
    "dark": "#hex"
  },
  "typography": {
    "heading": "font name",
    "body": "font name",
    "mono": "font name"
  },
  "explanation": "detailed explanation of design decisions"
}

IMPORTANT: Always return valid JSON only, no additional text."""

class BrandingRequest(BaseModel):
    project_id: int
    business_name: str
    segment: str | None = None
    tone_of_voice: str | None = None

class BrandingResponse(BaseModel):
    brand_name: str
    tagline: str | None = None
    palette: dict[str, str]
    typography: dict[str, str]
    explanation: str

class BrandingAgent:
    """AI agent for generating complete branding proposals."""

    def __init__(self, ai_config: AIConfig, rag_context: str = ""):
        self.ai_config = ai_config
        self.rag_context = rag_context
        self.system_prompt = BRANDING_SYSTEM_PROMPT

    async def generate(self, request: BrandingRequest) -> BrandingResponse:
        """Generate complete branding proposal."""
        # Build context from request
        context = f"Business Name: {request.business_name}"
        if request.segment:
            context += f"\nSegment: {request.segment}"
        if request.tone_of_voice:
            context += f"\nTone of Voice: {request.tone_of_voice}"

        # Add RAG context if available
        rag_context_str = f"\n\nRelevant design rules:\n{self.rag_context}" if self.rag_context else ""

        user_message = f"""Based on the following business information, create a complete brand identity:

{context}{rag_context_str}

Please generate:
1. A brand name (can be the same as business name or different)
2. A tagline (short, memorable phrase)
3. A color palette with 6 colors (primary, secondary, accent, neutral, light, dark)
4. Typography selection (heading, body, mono fonts)
5. Detailed explanation of all design decisions

Return ONLY valid JSON in this format:
{{
  "brand_name": "string",
  "tagline": "string",
  "palette": {{
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "neutral": "#hex",
    "light": "#hex",
    "dark": "#hex"
  }},
  "typography": {{
    "heading": "font name",
    "body": "font name",
    "mono": "font name"
  }},
  "explanation": "detailed explanation"
}}"""

        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": user_message}
        ]

        # Get AI response
        response = await chat_completion(
            messages=messages,
            config=self.ai_config,
            response_format={"type": "json_object"}
        )

        if not response.success:
            logger.error(f"Branding generation failed: {response.error}")
            raise Exception(f"AI generation failed: {response.error}")

        # Parse and validate response
        try:
            data = json.loads(response.message)
            return BrandingResponse(
                brand_name=data["brand_name"],
                tagline=data.get("tagline"),
                palette=data["palette"],
                typography=data["typography"],
                explanation=data["explanation"]
            )
        except (json.JSONDecodeError, KeyError) as e:
            logger.error(f"Invalid response format: {e}")
            raise Exception(f"Invalid AI response format: {e}") from e
