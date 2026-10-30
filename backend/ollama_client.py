"""
Ollama Client for NecroTerm.
Streams tokens from local open-weights Gemma 2 (or configured model).
Includes resilience fallback so the séance continues even if a model is loading.
"""

import os
import json
import logging
from typing import AsyncGenerator, Optional, Dict, Any
import httpx

logger = logging.getLogger("necroterm.ollama")

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
DEFAULT_MODEL = os.getenv("OLLAMA_MODEL", "gemma2:latest")

async def check_ollama_health() -> Dict[str, Any]:
    """Check if local Ollama daemon is reachable and list models."""
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            resp = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            if resp.status_code == 200:
                models_data = resp.json()
                models = [m.get("name") for m in models_data.get("models", [])]
                has_gemma = any("gemma" in m.lower() for m in models)
                preferred = DEFAULT_MODEL if has_gemma else (models[0] if models else DEFAULT_MODEL)
                return {
                    "connected": True,
                    "available_models": models,
                    "gemma_ready": has_gemma,
                    "primary_model": preferred
                }
    except Exception as e:
        logger.warning(f"Ollama connection check failed: {e}")
    
    return {
        "connected": False,
        "available_models": [],
        "gemma_ready": False,
        "primary_model": DEFAULT_MODEL
    }


async def stream_spirit_dialogue(
    prompt: str,
    system_prompt: str,
    model: str = DEFAULT_MODEL,
    temperature: float = 0.8
) -> AsyncGenerator[str, None]:
    """
    Stream token-by-token response from Gemma 2 via Ollama.
    Yields chunks formatted as SSE text data.
    """
    # Verify model availability
    health = await check_ollama_health()
    active_model = model
    if not health.get("gemma_ready") and health.get("available_models"):
        active_model = health["available_models"][0]
        logger.info(f"Gemma not detected; falling back to available model: {active_model}")

    payload = {
        "model": active_model,
        "prompt": prompt,
        "system": system_prompt,
        "stream": True,
        "options": {
            "temperature": temperature,
            "top_p": 0.9,
            "top_k": 40
        }
    }

    try:
        async with httpx.AsyncClient(timeout=180.0) as client:
            async with client.stream("POST", f"{OLLAMA_BASE_URL}/api/generate", json=payload) as response:
                if response.status_code != 200:
                    err_text = await response.aread()
                    yield f"data: {json.dumps({'error': f'Ollama error {response.status_code}: {err_text.decode()}'})}\n\n"
                    return

                async for line in response.aiter_lines():
                    if not line:
                        continue
                    try:
                        chunk = json.loads(line)
                        token = chunk.get("response", "")
                        done = chunk.get("done", False)
                        if token or done:
                            yield f"data: {json.dumps({'token': token, 'done': done})}\n\n"
                        if done:
                            break
                    except json.JSONDecodeError:
                        continue

    except Exception as e:
        logger.error(f"Error during Ollama streaming: {e}")
        spectral_fallback = (
            f"*The ethereal fog thickens: [{str(e)}]. "
            f"Verify your local Ollama daemon is running at localhost:11434 with model '{active_model}'.*"
        )
        yield f"data: {json.dumps({'token': spectral_fallback, 'done': True, 'error': str(e)})}\n\n"
