# 🕯️ NecroTerm: An Ethereal Séance with Computing's Past 👻

> **"Ghost in the Machine" — Hacktoberfest 2026 Open-Source AI Challenge (Week 4)**  
> *Powered by local open-weights **Gemma 2**, procedural WebAudio synthesis, and an interactive occult Ouija interface.*

[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest-2026-blueviolet?style=for-the-badge&logo=hacktoberfest)](https://dev.to/challenges/hacktoberfest-week4-2026-10-26)
[![AI Model: Gemma 2](https://img.shields.io/badge/Model-Gemma_2_Open--Weights-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/gemma)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 🔮 What is NecroTerm?

**NecroTerm** is a haunted, retro-cyberpunk terminal and interactive Ouija séance interface that bridges modern computing dilemmas with the departed pioneers of computer science history. 

In the spirit of **Halloween** and **Día de los Muertos (Day of the Dead)**, NecroTerm summons the spirits who programmed with vacuum tubes, punchcards, and core memory to examine the bloated state of modern software engineering.

Ask a dilemma, or offer a "code sacrifice" (paste modern TypeScript, Python, or Rust), and watch the spirit tear down your layers of abstraction, scold your 2-gigabyte `node_modules`, and transmute the code into an archaic paradigm (Babbage punchcard specs, FLOW-MATIC, B, or pure lambda calculus).

---

## ✨ Key Features

### 1. 📜 Interactive Ouija Board & Sliding Planchette
- Authentic arched alphabet, numbers, YES, NO, and GOODBYE seals.
- A **magnetic planchette** slides dynamically across the board in real time, tracking the active tokens streaming from **Gemma 2**, with center lens magnification and wooden scraping audio!

### 2. 🏛️ The Spectral Pantheon (Departed Computing Pioneers)
- **Countess Ada Lovelace (1843)** — *The Enchantress of Numbers*. Examines modern algorithms through Charles Babbage's Analytical Engine and weaving punchcards.
- **Rear Admiral Grace Hopper (1952)** — *The Grand Dame of Compilers*. Scolds memory bloat, brings out her 11.8-inch nanosecond wire, and tracks down literal bugs.
- **Brother of the LISP Machine (1979)** — *The Lambda Monk of MIT*. Speaks in recursive philosophical chants and nested parentheses, mourning the fall of pure symbolic machines.
- **Dennis Ritchie & Bell Labs (1972)** — *Architect of C & UNIX*. Dry, laconic, pipe-smoking engineer who believes in plain text, raw pointers, and radical simplicity.
- **The Y2K Doomsday Oracle (1999)** — *Spectre of the Millennium Bug*. Hyperventilating over two-digit date fields in a frantic time-loop at 11:59 PM.

### 3. 🕯️ The Melting Candle of Life
- An animated virtual wax candle flickers on screen with dynamic flame physics.
- Each query slowly melts the candle down. If the candle expires, the ethereal connection freezes until you strike a match to relight the vessel!

### 4. 🎛️ Procedural WebAudio Soundscape & Voice
- **Zero external audio files:** Synthesizes mechanical keyboard clatter, mains transformer hum, relay clicks, planchette friction, and spirit chimes using the native **Web Audio API**.
- **Voice Synthesis:** Supports **ElevenLabs** vintage radio/gramophone audio with automatic fallback to vintage browser speech synthesis.

### 5. 📺 Authentic CRT Experience
- Switch between **Phosphor Green**, **Amber Phosphor**, and **Ghost Cyan** CRT palettes with scanline shaders, curvature, and subtle bloom flicker.
- Export full séance transcripts to Markdown (`SEANCE_RECORD.md`).

---

## 🏗️ Architecture

```
necroterm/
├── backend/
│   ├── app.py                  # FastAPI server with SSE streaming & CORS
│   ├── personas.py             # Historical pioneer system prompts & metadata
│   ├── ollama_client.py        # Local Gemma 2 inference streaming client
│   ├── elevenlabs_client.py    # Optional ElevenLabs vintage voice synthesis
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── OuijaBoard.jsx      # Magnetic sliding planchette + occult layout
│   │   │   ├── SpiritSelector.jsx  # Pioneer dossier & one-click invocations
│   │   │   ├── Candle.jsx          # Melting candle of life & relight mechanics
│   │   │   └── TerminalLog.jsx     # CRT text stream, code viewer & voice buttons
│   │   ├── utils/
│   │   │   └── audio.js            # Web Audio procedural synthesis engine
│   │   ├── App.jsx                 # Master layout & color theme switcher
│   │   └── index.css               # CRT scanlines & phosphor bloom
│   ├── package.json
│   └── vite.config.js
├── run_necroterm.py            # One-click universal launcher
├── start.bat                   # Windows batch script launcher
└── SUBMISSION.md               # Ready-to-publish DEV Challenge submission
```

---

## 🚀 Quickstart

### Prerequisites
1. **Python 3.10+**
2. **Node.js 18+**
3. **Ollama** installed with **Gemma 2**:
   ```bash
   ollama pull gemma2:latest
   ```

### Running NecroTerm
Clone the repository and run the launcher:

```bash
# Clone the repository
git clone https://github.com/your-username/necroterm.git
cd necroterm

# Option A: Universal Launcher (starts both backend & frontend)
python run_necroterm.py

# Option B: Windows double-click
start.bat
```

Open your browser at **`http://localhost:5173`** and begin the séance!

*(Optional) To enable ElevenLabs voices, add your API key to `backend/.env`:*
```env
ELEVENLABS_API_KEY=your_key_here
```

---

## 💡 Why Does Open Innovation Matter?

1. **Air-Gapped Privacy for Code Sacrifices:** Developers should never paste proprietary codebase secrets, internal business logic, or private commit logs into closed corporate cloud APIs. Running **Gemma 2 locally** guarantees that sensitive code never leaves your machine.
2. **Unsanitized, Authentic Creative Personas:** Closed commercial models suffer from corporate homogenization and safety filters that strip away eccentric historical character. Open-weight models preserve genuine creative freedom and nuanced persona roleplay.
3. **Preservation Beyond Corporate Gatekeepers:** In the spirit of Día de los Muertos, open innovation ensures that software tools can be preserved and run decades from now—even with the lights (and internet) off.

---

## 🏆 Partner Prize Categories Entered
- 🌟 **Best Use of Gemma:** Core intelligence powered entirely by Google's open-weights Gemma 2 (`gemma2:latest`).
- 🎙️ **Best Use of ElevenLabs:** Eerie vintage radio / gramophone voice synthesis for the departed pioneers.
- 🚀 **Best Use of Render / DigitalOcean:** Portable containerized architecture ready for cloud deployment.

---

## 📜 License
MIT License. Crafted with spooky delight for **Hacktoberfest 2026**.
