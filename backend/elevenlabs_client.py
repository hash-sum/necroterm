"""
ElevenLabs Integration for NecroTerm.
Synthesizes speech with eerie vintage radio/phonograph qualities.
Supports direct audio streaming and voice mapping for historical spirits.
"""

import os
import logging
from typing import Optional, Dict, Any
import httpx

logger = logging.getLogger("necroterm.elevenlabs")

ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1"

# Curated ElevenLabs voice ID profiles matching historical spirits
SPIRIT_VOICES: Dict[str, str] = {
    "ada": "21m00Tcm4TlvDq8ikWAM",      # Rachel - British/Victorian clear tone
    "grace": "EXAVITQu4vr4xnSDxMaL",    # Bella - Crisp, authoritative
    "lisp": "ErXwobaYiN019PkySvjV",     # Antoni - Echoey, solemn monk-like
    "ritchie": "VR6AewLTigWG4xSOukaG",  # Arnold - Gritty, deep, weathered
    "y2k": "AZnzlk1XvdvUeBnXmlld"       # Domi - Urgent, energetic, nervous
}

def get_api_key() -> Optional[str]:
    return os.getenv("ELEVENLABS_API_KEY")

async def synthesize_speech(
    text: str,
    spirit_id: str = "ada",
    stability: float = 0.45,
    similarity_boost: float = 0.75
) -> Optional[bytes]:
    """
    Synthesize audio using ElevenLabs API.
    Returns raw MP3 audio bytes, or None if no key configured or error occurs.
    """
    api_key = get_api_key()
    if not api_key:
        logger.info("No ELEVENLABS_API_KEY configured; client will use WebAudio speech synthesis.")
        return None

    voice_id = SPIRIT_VOICES.get(spirit_id, "21m00Tcm4TlvDq8ikWAM")
    
    # Truncate text to avoid consuming excessive credits in hackathon demos
    clean_text = text.strip()[:600]

    headers = {
        "xi-api-key": api_key,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
    }

    payload = {
        "text": clean_text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": stability,
            "similarity_boost": similarity_boost,
            "style": 0.3,
            "use_speaker_boost": True
        }
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                f"{ELEVENLABS_BASE_URL}/text-to-speech/{voice_id}",
                headers=headers,
                json=payload
            )
            if resp.status_code == 200:
                return resp.content
            else:
                logger.error(f"ElevenLabs error {resp.status_code}: {resp.text}")
                return None
    except Exception as e:
        logger.error(f"Failed to synthesize voice with ElevenLabs: {e}")
        return None
