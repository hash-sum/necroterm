import React, { useState, useEffect, useRef } from 'react';
import { 
  Skull, Flame, Volume2, VolumeX, Send, Code, Sparkles, 
  Download, Terminal, RefreshCw, AlertTriangle, Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';

import OuijaBoard from './components/OuijaBoard';
import SpiritSelector from './components/SpiritSelector';
import Candle from './components/Candle';
import TerminalLog from './components/TerminalLog';
import { soundEngine } from './utils/audio';

export default function App() {
  const [spirits, setSpirits] = useState([]);
  const [currentSpirit, setCurrentSpirit] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');
  const [latestToken, setLatestToken] = useState('');
  const [candleLife, setCandleLife] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [theme, setTheme] = useState('green'); // 'green' | 'amber' | 'cyan'
  const [audioLoading, setAudioLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState(null);

  // Initialize audio and fetch spirits on mount
  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(data => setSystemStatus(data))
      .catch(err => console.warn("Backend not yet up or starting:", err));

    fetch('/api/spirits')
      .then(r => r.json())
      .then(data => {
        setSpirits(data);
        if (data.length > 0) {
          setCurrentSpirit(data[0]); // default: Ada Lovelace
        }
      })
      .catch(err => console.error("Error fetching spirits:", err));
  }, []);

  const handleAudioToggle = () => {
    soundEngine.init();
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleRelight = () => {
    setCandleLife(100);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#ff8800', '#ffcc00', '#33ff33']
    });
  };

  const handleSend = async (customPrompt = null) => {
    const promptToSend = customPrompt || inputMessage;
    if (!promptToSend.trim() || isStreaming) return;
    if (candleLife <= 0) {
      alert("The candle has burned down! Strike a match to relight the connection before invoking the departed.");
      return;
    }

    soundEngine.init();
    soundEngine.playKeyClick();

    const userMessage = {
      role: 'user',
      content: promptToSend,
      codeSnippet: showCodeInput && codeSnippet.trim() ? codeSnippet : null,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsStreaming(true);
    setStreamingResponse('');
    setLatestToken('');

    // Deplete candle by 5% per query
    setCandleLife(prev => Math.max(0, prev - 5));

    try {
      const response = await fetch('/api/seance/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spirit_id: currentSpirit.id,
          message: promptToSend,
          code_snippet: userMessage.codeSnippet,
          candle_life: candleLife
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.token) {
                fullText += data.token;
                setStreamingResponse(fullText);
                setLatestToken(data.token);
                soundEngine.playTokenClick();
              }
              if (data.done) {
                soundEngine.playSpiritChime(currentSpirit?.ambient_freq || 440);
              }
            } catch (e) {
              // Non-fatal SSE parse
            }
          }
        }
      }

      // Append completed message
      setMessages(prev => [
        ...prev,
        {
          role: 'spirit',
          content: fullText,
          spiritId: currentSpirit.id,
          spiritName: currentSpirit.name,
          spiritEra: currentSpirit.era,
          spiritIcon: currentSpirit.icon,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } catch (err) {
      console.error("Stream error:", err);
      setMessages(prev => [
        ...prev,
        {
          role: 'spirit',
          content: `*The ethereal connection snapped with a low hum: ${err.message}. Ensure the local Gemma 2 Ollama daemon is whispering at localhost:11434.*`,
          spiritId: currentSpirit.id,
          spiritName: currentSpirit.name,
          spiritEra: currentSpirit.era,
          spiritIcon: currentSpirit.icon,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setIsStreaming(false);
      setStreamingResponse('');
      setLatestToken('');
    }
  };

  const handlePlayVoice = async (text, spiritId) => {
    soundEngine.init();
    setAudioLoading(true);

    try {
      const resp = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spirit_id: spiritId, text: text })
      });

      const contentType = resp.headers.get('content-type') || '';

      if (contentType.includes('audio/mpeg')) {
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
      } else {
        // Fallback to Web Speech API with vintage cadence
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text.slice(0, 350));
          utterance.rate = 0.9;
          utterance.pitch = spiritId === 'ada' ? 1.2 : spiritId === 'ritchie' ? 0.8 : 1.0;
          window.speechSynthesis.speak(utterance);
        }
      }
    } catch (e) {
      console.error("Audio synthesis error:", e);
    } finally {
      setAudioLoading(false);
    }
  };

  const handleExportTranscript = () => {
    const header = `# NecroTerm: Ethereal Séance Transcript\n**Date:** ${new Date().toLocaleString()}\n**Summoned Spirit:** ${currentSpirit?.name} (${currentSpirit?.era})\n\n---\n\n`;
    const body = messages.map(m => {
      if (m.role === 'user') {
        return `### 👤 Petitioner [${m.timestamp}]\n${m.content}\n${m.codeSnippet ? `\`\`\`\n${m.codeSnippet}\n\`\`\`\n` : ''}`;
      } else {
        return `### ${m.spiritIcon} ${m.spiritName} [${m.timestamp}]\n${m.content}\n`;
      }
    }).join('\n---\n\n');

    const blob = new Blob([header + body], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seance_${currentSpirit?.id || 'oracle'}_${Date.now()}.md`;
    a.click();
  };

  // Color theme classes
  const themeClasses = {
    green: {
      text: 'text-[#33ff33]',
      border: 'border-[#1b4324]',
      bg: 'bg-[#030804]',
      glow: 'crt-bloom',
    },
    amber: {
      text: 'text-[#ffb000]',
      border: 'border-[#4a3400]',
      bg: 'bg-[#0d0901]',
      glow: 'crt-bloom-amber',
    },
    cyan: {
      text: 'text-[#00f0ff]',
      border: 'border-[#003842]',
      bg: 'bg-[#01090d]',
      glow: 'crt-bloom',
    }
  }[theme];

  return (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} p-3 sm:p-6 relative select-none font-mono crt-flicker`}>
      {/* Authentic CRT Screen Scanline & Vignette Overlays */}
      <div className="crt-overlay"></div>
      <div className="crt-vignette"></div>

      {/* Top Header Banner */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 pb-4 mb-4 border-b border-[#1b4324]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#0e2413] border border-[#22c55e]/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <Skull className="w-6 h-6 text-[#33ff33]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-widest uppercase crt-bloom">
                NECRO<span className="text-white">TERM</span>
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950/80 border border-purple-600 text-purple-300 font-bold uppercase tracking-wider">
                Hacktoberfest '26
              </span>
            </div>
            <p className="text-xs text-[#2ea84e] tracking-tight">
              An Ethereal Séance with Computing's Departed Ancestors • Powered by Gemma 2
            </p>
          </div>
        </div>

        {/* Status Pills & Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Ollama Gemma Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0a1b0e] border border-[#1d4b24] text-[11px] text-[#2ea84e]">
            <Radio className="w-3.5 h-3.5 text-green-400 animate-pulse" />
            <span>Gemma 2 (Local Open-Weights)</span>
          </div>

          {/* Theme Palette Switcher */}
          <div className="flex items-center gap-1 bg-[#09150b] border border-[#1b3d22] rounded-lg p-1">
            <button
              onClick={() => setTheme('green')}
              className={`w-4 h-4 rounded-full bg-[#33ff33] cursor-pointer transition-transform ${theme === 'green' ? 'ring-2 ring-white scale-110' : 'opacity-40'}`}
              title="Phosphor Green"
            />
            <button
              onClick={() => setTheme('amber')}
              className={`w-4 h-4 rounded-full bg-[#ffb000] cursor-pointer transition-transform ${theme === 'amber' ? 'ring-2 ring-white scale-110' : 'opacity-40'}`}
              title="Amber Phosphor"
            />
            <button
              onClick={() => setTheme('cyan')}
              className={`w-4 h-4 rounded-full bg-[#00f0ff] cursor-pointer transition-transform ${theme === 'cyan' ? 'ring-2 ring-white scale-110' : 'opacity-40'}`}
              title="Ghost Cyan"
            />
          </div>

          {/* Audio Mute Toggle */}
          <button
            onClick={handleAudioToggle}
            className="p-1.5 rounded bg-[#0b1f10] border border-[#1d4624] hover:border-[#33ff33] text-[#2ea84e] hover:text-[#33ff33] cursor-pointer transition-colors"
            title={isMuted ? 'Unmute procedural audio' : 'Mute procedural audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-green-400" />}
          </button>

          {/* Export Transcript */}
          <button
            onClick={handleExportTranscript}
            disabled={messages.length === 0}
            className="px-2.5 py-1 rounded bg-[#0b1f10] border border-[#1d4624] hover:border-[#33ff33] text-[#2ea84e] hover:text-[#33ff33] cursor-pointer text-xs flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Export Séance record as Markdown"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Ouija Board & Spirit Selector (5 cols) */}
        <section className="lg:col-span-5 space-y-4">
          <OuijaBoard
            activeToken={latestToken}
            isStreaming={isStreaming}
            currentSpirit={currentSpirit}
          />

          <SpiritSelector
            spirits={spirits}
            currentSpirit={currentSpirit}
            onSelectSpirit={setCurrentSpirit}
            onSampleClick={(prompt) => handleSend(prompt)}
            disabled={isStreaming}
          />
        </section>

        {/* Right Column: Terminal, Candle & Ritual Chamber (7 cols) */}
        <section className="lg:col-span-7 flex flex-col space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-grow">
              <TerminalLog
                messages={messages}
                streamingResponse={streamingResponse}
                isStreaming={isStreaming}
                currentSpirit={currentSpirit}
                onPlayVoice={handlePlayVoice}
                audioLoading={audioLoading}
              />
            </div>
            {/* The Melting Candle */}
            <Candle
              candleLife={candleLife}
              onRelight={handleRelight}
            />
          </div>

          {/* Ritual Control Chamber (Input Bar) */}
          <div className="bg-[#071309] border border-[#18391e] rounded-xl p-3 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setShowCodeInput(!showCodeInput)}
                className={`text-[11px] font-mono px-2.5 py-1 rounded border flex items-center gap-1.5 transition-all cursor-pointer ${
                  showCodeInput
                    ? 'bg-[#153e1f] border-[#22c55e] text-[#33ff33] font-bold'
                    : 'bg-[#0b1a0d] border-[#18381e] text-[#2ea84e] hover:border-[#22c55e]'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>{showCodeInput ? 'Hide Code Sacrifice' : 'Offer Code Sacrifice (Transmute)'}</span>
              </button>

              <span className="text-[10px] text-[#2ea84e] font-mono">
                {currentSpirit ? `Channeling ${currentSpirit.name}` : ''}
              </span>
            </div>

            {/* Code Sacrifice Input Box */}
            {showCodeInput && (
              <div className="mb-2">
                <textarea
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  placeholder="// Paste modern code here (TypeScript, Python, Rust, Go)...&#10;// The spirit will tear down its abstractions and forge an archaic equivalent."
                  rows={4}
                  className="w-full bg-[#020503] border border-[#1d4624] rounded-lg p-2 text-xs font-mono text-[#6ee787] focus:outline-none focus:border-[#22c55e] resize-y placeholder:text-neutral-700"
                />
              </div>
            )}

            {/* Query Input */}
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#33ff33] font-bold">
                  &gt;
                </span>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    soundEngine.playKeyClick();
                    if (e.key === 'Enter') handleSend();
                  }}
                  disabled={isStreaming}
                  placeholder={
                    candleLife <= 0
                      ? 'The candle has expired. Relight it above to continue...'
                      : `Ask ${currentSpirit?.name || 'the spirit'} or type a dilemma...`
                  }
                  className="w-full bg-[#030904] border border-[#1c4723] rounded-lg pl-7 pr-3 py-2 text-xs sm:text-sm text-[#33ff33] focus:outline-none focus:border-[#22c55e] crt-bloom placeholder:text-[#183c20] disabled:opacity-50"
                />
              </div>

              <button
                onClick={() => handleSend()}
                disabled={isStreaming || !inputMessage.trim() || candleLife <= 0}
                className="px-4 py-2 rounded-lg bg-[#14421d] hover:bg-[#1a5525] border border-[#22c55e] text-[#33ff33] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(34,197,94,0.2)]"
              >
                {isStreaming ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Invoke</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Details */}
      <footer className="max-w-7xl mx-auto mt-6 pt-4 border-t border-[#143219] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#245830] gap-2">
        <p>
          Built for <strong className="text-[#2ea84e]">Hacktoberfest 2026: Ghost in the Machine</strong> • 100% Offline & Open-Weights with <span className="text-[#33ff33]">Gemma 2</span>
        </p>
        <p className="flex items-center gap-2">
          <span>Remembering those who programmed with punchcards, core memory, and vacuum tubes</span>
          <span>🌼 🎃</span>
        </p>
      </footer>
    </div>
  );
}
