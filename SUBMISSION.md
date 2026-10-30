---
title: "NecroTerm: An Ethereal Séance with Computing's Past (Powered by Gemma 2)"
published: true
tags: devchallenge, hf26challenge, ai, hacktoberfest
canonical_url: false
---

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 4: Ghost in the Machine](https://dev.to/challenges/hacktoberfest-week4-2026-10-26)*

---

## What I Built

Every October, as Halloween approaches and Día de los Muertos begins, the boundary between past and present grows thin. But while the physical world honors human ancestors, what about the ancestors of computing? 

What happened to the engineers who wrote compilers on punchcards, debugged with magnifying glasses, and sent Apollo 11 to the moon on 64 kilobytes of memory?

Meet **NecroTerm: An Ethereal Séance with Computing's Past**.

**NecroTerm** is a retro-cyberpunk terminal and interactive Ouija séance interface that connects living developers with the departed pioneers of computer science. Powered by **Google's open-weights Gemma 2** running completely locally, NecroTerm invites you to summon historical figures to diagnose modern software bloat, scold our 2GB `node_modules` folders, and transmute modern code into archaic computing paradigms.

### ✨ Core Capabilities:
1. **Interactive Ouija Board & Sliding Planchette:** An authentic arched alphabet where a physical wooden planchette glides dynamically across the board, tracking the tokens streaming from Gemma 2 in real time with wooden friction audio!
2. **The Spectral Pantheon:** Summon **Countess Ada Lovelace** (1843), **Rear Admiral Grace Hopper** (1952), the **LISP Machine Monk** (1979), **Dennis Ritchie** (1972), or the frantic **Y2K Doomsday Oracle** (1999).
3. **The Melting Candle of Life:** An animated wax candle with flickering flame physics that melts down with each question. If it expires, the séance connection freezes until you strike a match to relight the vessel.
4. **Code Sacrifice (Transmutation):** Paste modern TypeScript, Python, or Rust. The spirit deconstructs your abstractions and renders the equivalent in punchcards, FLOW-MATIC, B, or pure lambda calculus.
5. **Procedural WebAudio Soundscape:** Zero external MP3 files—procedurally generates relay ticks, keyboard clatter, mains transformer hum, and spirit chimes using the browser's native Web Audio API, paired with optional **ElevenLabs** vintage radio voice synthesis.
6. **Authentic CRT Palettes:** Switch between Phosphor Green, Amber, and Ghost Cyan with scanlines, screen curvature, and bloom shaders.

---

## Demo

> 📺 **Live Video Demo[(https://youtu.be/aug6IQLh9P4)]

### A Glimpse into the Séance:
```
[Petitioner]: "Why does my simple React landing page take 400 Megabytes of memory?"

[Rear Admiral Grace Hopper]: 
"Good heavens, lieutenant! Four hundred megabytes for a brochure? In 1952, we 
mapped ballistic missile trajectories using vacuum tubes and magnetic drums 
measured in words, not gigabytes! Here, hold this 11.8-inch piece of wire—that is 
a nanosecond, the maximum distance light travels in a billionth of a second. Every 
unnecessary abstraction layer you pile on is dragging your electrons across miles 
of virtual desert. Cut the bloat and get back to work!"
```

---

## Code

The complete source code is open source under the MIT License:

{% github your-username/necroterm %}

*(Replace with your GitHub repository link)*

---

## How I Built It

NecroTerm was architected with a strict privacy-first, offline-capable design:

```
┌────────────────────────────────────────────────────────┐
│               NecroTerm Frontend (Vite)                │
│  - React 19 + Tailwind v4 CRT Shaders                  │
│  - Interactive Ouija Board & Magnetic Planchette       │
│  - Web Audio API Procedural Sound Synthesizer          │
└───────────────────────────┬────────────────────────────┘
                            │ SSE Stream & Voice API
┌───────────────────────────▼────────────────────────────┐
│              FastAPI Netherworld Backend                │
│  - Server-Sent Events (SSE) Streaming Engine           │
│  - Historical Persona Prompt Orchestration             │
│  - ElevenLabs Vintage Speech Synthesis Adapter         │
└─────────────┬───────────────────────────┬──────────────┘
              │                           │
┌─────────────▼─────────────┐ ┌───────────▼──────────────┐
│  Ollama: Gemma 2 (9B)     │ │ ElevenLabs Voice API     │
│  (Local Open Weights)     │ │ (Vintage Radio Filter)   │
└───────────────────────────┘ └──────────────────────────┘
```

1. **Local Open-Weights Engine:** We utilized **Gemma 2 (9B)** running locally via Ollama. Gemma 2's extraordinary reasoning density and stylistic flexibility allowed each pioneer's distinct historical voice—from Lovelace's 19th-century Victorian elegance to Hopper's crisp military cadence—to shine without sounding like generic corporate chatbot output.
2. **Server-Sent Events (SSE):** The backend streams tokens chunk-by-chunk directly to the browser. As each token arrives, the frontend calculates coordinates on the Ouija board, triggering the CSS/SVG planchette to physically glide toward the active letters.
3. **Procedural WebAudio Synthesis:** To keep the project lightweight and self-contained, all environmental audio (the 58Hz mains transformer hum, teletype relay clicks, wooden planchette friction, and resonant bell harmonics) is synthesized mathematically in JavaScript with `AudioContext`.

---

## Why Does Open Innovation Matter?

When interpreting the "Ghost in the Machine" prompt, the open-source ethos wasn't just a requirement—it was the foundational philosophy of what we built.

Here is why open innovation made NecroTerm possible:

1. **Air-Gapped Privacy for Code Sacrifices:** Developers frequently paste proprietary snippets, internal architecture questions, and personal code into NecroTerm's "Transmutation Chamber". You cannot send proprietary corporate intellectual property to closed third-party cloud APIs. Because **Gemma 2 runs 100% locally on device**, zero bytes of user code ever leave the developer's laptop.
2. **Uncensored, Authentic Historical Expression:** Closed commercial LLMs enforce strict corporate safety filters that homogenize tone, turning every persona into a sanitized corporate customer service agent. Open-weight models like Gemma give builders the freedom to craft authentic, eccentric, biting, and emotionally resonant historical characters.
3. **Preservation with the Lights (and Internet) Off:** In the spirit of Día de los Muertos, open innovation ensures digital permanence. Closed SaaS APIs can be deprecated, acquired, or shut down behind paywalls at any moment. An open-weight model committed to an open-source repo will remain runnable 30 years from now on an offline machine in the dark.

---

## My Agent Session

This project was conceived, planned, designed, and implemented with the assistance of an agentic coding partner. You can inspect the development session transcript below:

*(Optional: Add DevRelay session link or session tag here)*

---

## The Spirit of It

During testing, we pasted a convoluted 80-line nested async function with 14 chained callbacks and asked the ghost of **Dennis Ritchie** for his diagnosis.

The CRT scanlines flickered, the procedural transformer hum dropped, and the Ouija planchette drifted slowly toward the letter **S**:

> *"Ken and I built UNIX on a PDP-7 with 8 kilobytes of memory. A file is a sequence of bytes. A pipe is a stream. When I look at your fourteen nested promise callbacks to fetch a single username, I do not see progress. I see developers building cathedrals out of dry leaves. Delete it and use a pointer."*

It gave us genuine goosebumps—partly because it was eerie, but mostly because he was right.

---

## Prize Categories

We are entering the following partner categories:

- **Best Use of Gemma:** The entire reasoning engine, historical roleplay system, and code transmutation pipeline are powered exclusively by Google's open-weights **Gemma 2**.
- **Best Use of ElevenLabs:** Synthesizes period-accurate, crackling vintage radio and phonograph voices for each summoned computing spirit.
- **Best Use of Render / DigitalOcean:** Portable containerized architecture ready for immediate cloud deployment.

---

*Happy Hacktoberfest and Día de los Muertos! Keep the candles burning and your memory allocations clean. 🎃🌼*
