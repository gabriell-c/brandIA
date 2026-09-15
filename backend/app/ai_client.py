"""
OpenAI-compatible AI client supporting multiple providers.
"""
import asyncio
import logging
from dataclasses import dataclass
from datetime import datetime

import httpx

logger = logging.getLogger(__name__)

@dataclass
class AIConfig:
    provider: str  # openai, anthropic, ollama
    base_url: str
    api_key: str
    model: str
    timeout: int = 30
    max_retries: int = 3

class AIResponse:
    def __init__(self, success: bool, data: dict | None = None, error: str | None = None):
        self.success = success
        self.data = data
        self.error = error
        self.timestamp = datetime.utcnow().isoformat()

class AIChatResponse(AIResponse):
    def __init__(self, success: bool, message: str | None = None, **kwargs):
        super().__init__(success, **kwargs)
        self.message = message
        self.usage: dict | None = None

class OpenAIClient:
    """Client for OpenAI-compatible APIs."""

    def __init__(self, config: AIConfig):
        self.config = config
        self.client = httpx.AsyncClient(
            base_url=config.base_url,
            timeout=httpx.Timeout(config.timeout),
            headers={
                "Authorization": f"Bearer {config.api_key}",
                "Content-Type": "application/json"
            }
        )

    async def chat(self, messages: list, response_format: dict | None = None) -> AIChatResponse:
        """Send chat completion request."""
        try:
            payload = {
                "model": self.config.model,
                "messages": messages,
            }
            if response_format:
                payload["response_format"] = response_format

            response = await self.client.post("/chat/completions", json=payload)
            response.raise_for_status()

            data = response.json()
            message = data["choices"][0]["message"]

            return AIChatResponse(
                success=True,
                message=message.get("content"),
                usage=data.get("usage")
            )
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error: {e.response.status_code} - {e.response.text}")
            return AIChatResponse(success=False, error=str(e))
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return AIChatResponse(success=False, error=str(e))
        finally:
            await self.client.aclose()

class AnthropicClient:
    """Client for Anthropic Claude API."""

    def __init__(self, config: AIConfig):
        self.config = config
        self.client = httpx.AsyncClient(
            base_url=config.base_url,
            timeout=httpx.Timeout(config.timeout),
            headers={
                "x-api-key": config.api_key,
                "anthropic-version": "2023-06-01",
                "Content-Type": "application/json"
            }
        )

    async def chat(self, messages: list, response_format: dict | None = None) -> AIChatResponse:
        """Send Anthropic completion request."""
        try:
            # Convert OpenAI format to Anthropic format
            system_msg = None
            user_messages = []
            for msg in messages:
                if msg.get("role") == "system":
                    system_msg = msg.get("content")
                else:
                    user_messages.append({
                        "role": msg["role"],
                        "content": msg["content"]
                    })

            payload = {
                "model": self.config.model,
                "messages": user_messages,
                "max_tokens": 4096,
            }
            if system_msg:
                payload["system"] = system_msg

            response = await self.client.post("/v1/messages", json=payload)
            response.raise_for_status()

            data = response.json()
            content = data["content"][0]["text"] if data.get("content") else ""

            return AIChatResponse(
                success=True,
                message=content,
                usage=data.get("usage")
            )
        except httpx.HTTPStatusError as e:
            logger.error(f"Anthropic HTTP error: {e.response.status_code} - {e.response.text}")
            return AIChatResponse(success=False, error=str(e))
        except Exception as e:
            logger.error(f"Anthropic unexpected error: {e}")
            return AIChatResponse(success=False, error=str(e))
        finally:
            await self.client.aclose()

class OllamaClient:
    """Client for local Ollama API."""

    def __init__(self, config: AIConfig):
        self.config = config
        self.client = httpx.AsyncClient(
            base_url=config.base_url,
            timeout=httpx.Timeout(config.timeout)
        )

    async def chat(self, messages: list, response_format: dict | None = None) -> AIChatResponse:
        """Send Ollama completion request."""
        try:
            payload = {
                "model": self.config.model,
                "messages": messages,
                "stream": False,
            }

            response = await self.client.post("/api/chat", json=payload)
            response.raise_for_status()

            data = response.json()
            message = data.get("message", {}).get("content", "")

            return AIChatResponse(
                success=True,
                message=message
            )
        except httpx.HTTPStatusError as e:
            logger.error(f"Ollama HTTP error: {e.response.status_code} - {e.response.text}")
            return AIChatResponse(success=False, error=str(e))
        except Exception as e:
            logger.error(f"Ollama unexpected error: {e}")
            return AIChatResponse(success=False, error=str(e))
        finally:
            await self.client.aclose()

class AIProvider:
    """Factory class for creating AI clients."""

    _clients = {
        "openai": OpenAIClient,
        "anthropic": AnthropicClient,
        "ollama": OllamaClient,
    }

    @classmethod
    def create(cls, config: AIConfig):
        client_class = cls._clients.get(config.provider)
        if not client_class:
            raise ValueError(f"Unsupported provider: {config.provider}")
        return client_class(config)

# Global AI client instance
_ai_client = None
_ai_config = None

def get_ai_client(config: AIConfig):
    """Get or create AI client instance."""
    global _ai_client, _ai_config
    if _ai_config != config or _ai_client is None:
        _ai_config = config
        _ai_client = AIProvider.create(config)
    return _ai_client

async def chat_completion(
    messages: list,
    config: AIConfig,
    response_format: dict | None = None,
    max_retries: int = 3
) -> AIChatResponse:
    """Send chat completion with retry logic."""
    client = get_ai_client(config)
    last_error = None

    for attempt in range(max_retries):
        try:
            response = await client.chat(messages, response_format)
            if response.success:
                return response
            last_error = response.error
            logger.warning(f"Attempt {attempt + 1}/{max_retries} failed: {last_error}")
        except Exception as e:
            last_error = str(e)
            logger.warning(f"Attempt {attempt + 1}/{max_retries} error: {last_error}")

        # Exponential backoff
        if attempt < max_retries - 1:
            wait_time = 2 ** attempt
            logger.info(f"Retrying in {wait_time}s...")
            await asyncio.sleep(wait_time)

    return AIChatResponse(success=False, error=f"All {max_retries} attempts failed: {last_error}")
