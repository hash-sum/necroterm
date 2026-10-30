"""
NecroTerm Backend Server (FastAPI)
Bridges the physical living world with the departed spirits of computing history.
Powered by local open-weights Gemma 2 via Ollama and ElevenLabs audio.
"""

import os
import json
import logging
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse, Response, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from personas import SPIRITS
from ollama_client import check_ollama_health, stream_spirit_dialogue, DEFAULT_MODEL
from elevenlabs_client import synthesize_speech

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("necroterm.server")

app = FastAPI(
    title="NecroTerm: Ethereal Séance with Computing's Past",
    description="Hacktoberfest Week 4 (Ghost in the Machine) open-weights AI project.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SeanceRequest(BaseModel):
    spirit_id: str = Field(default="ada", description="The ID of the spirit to summon")
    message: str = Field(..., description="The query or dilemma presented to the spirit")
    code_snippet: Optional[str] = Field(default=None, description="Optional code snippet to analyze or transmute")
    candle_life: Optional[int] = Field(default=100, description="Current candle life percentage")

class VoiceRequest(BaseModel):
    spirit_id: str
    text: str

@app.get("/api/health")
async def health_check():
    """Returns system status, active models, and Ollama connection health."""
    ollama_status = await check_ollama_health()
    elevenlabs_configured = bool(os.getenv("ELEVENLABS_API_KEY"))
    return {
        "status": "ethereal_link_active",
        "theme": "Ghost in the Machine (Hacktoberfest 2026)",
        "ollama": ollama_status,
        "elevenlabs_active": elevenlabs_configured,
        "spirits_count": len(SPIRITS)
    }

@app.get("/api/spirits")
async def get_spirits():
    """Returns the pantheon of available historical computing spirits."""
    return list(SPIRITS.values())

@app.post("/api/seance/stream")
async def stream_seance(req: SeanceRequest):
    """
    Stream a spectral dialogue from Gemma 2 using Server-Sent Events (SSE).
    """
    spirit = SPIRITS.get(req.spirit_id)
    if not spirit:
        raise HTTPException(status_code=404, detail=f"Spirit '{req.spirit_id}' not found in the netherworld.")

    system_prompt = spirit["system_prompt"]
    
    # Craft the user prompt with ritual styling
    if req.code_snippet:
        user_prompt = (
            f"[SEANCE RITUAL INVOCATION]\n"
            f"The petitioner presents this modern code artifact to your gaze:\n"
            f"```\n{req.code_snippet}\n```\n"
            f"Question from the petitioner: {req.message}\n\n"
            f"Inspect this code with your historical eye. Explain why modern developers have strayed, "
            f"scold the bloat or praise the elegance in your unmistakable persona, and transmute its logic "
            f"into your era's computing paradigm (punchcard spec, FLOW-MATIC, B, pure lambda calculus, etc.)."
        )
    else:
        user_prompt = (
            f"[SEANCE RITUAL INVOCATION]\n"
            f"The living petitioner seeks your ancient wisdom: \"{req.message}\"\n\n"
            f"Speak through the veil, {spirit['name']}!"
        )

    return StreamingResponse(
        stream_spirit_dialogue(
            prompt=user_prompt,
            system_prompt=system_prompt,
            model=DEFAULT_MODEL
        ),
        media_type="text/event-stream"
    )

@app.post("/api/voice")
async def generate_voice(req: VoiceRequest):
    """
    Synthesize speech for a given spirit and text.
    Returns audio/mpeg bytes if ElevenLabs is configured, or JSON signal for WebAudio fallback.
    """
    audio_bytes = await synthesize_speech(req.text, spirit_id=req.spirit_id)
    if audio_bytes:
        return Response(content=audio_bytes, media_type="audio/mpeg")
    
    return JSONResponse(
        status_code=200,
        content={"fallback": True, "message": "Using browser WebAudio speech synthesis & filter."}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
