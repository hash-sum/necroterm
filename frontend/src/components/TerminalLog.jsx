import React, { useRef, useEffect, useState } from 'react';
import { Volume2, Copy, Check, Code, Sparkles, MessageSquare } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export default function TerminalLog({
  messages,
  streamingResponse,
  isStreaming,
  currentSpirit,
  onPlayVoice,
  audioLoading
}) {
  const terminalEndRef = useRef(null);
  const [copiedIdx, setCopiedIdx] = useState(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingResponse]);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="bg-[#050f07] border border-[#173a1d] rounded-xl p-4 min-h-[380px] max-h-[500px] overflow-y-auto flex flex-col justify-between shadow-2xl relative font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#143219] text-[#2ea84e] text-[11px] select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-900/60 border border-red-700"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-900/60 border border-yellow-700"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-900/60 border border-green-700"></div>
          </div>
          <span className="font-bold text-[#33ff33]">tty/necro-0</span>
          <span>—</span>
          <span>{currentSpirit?.name || 'Awaiting Invocation'}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#22c55e] animate-ping"></span>
          <span>ETHER_LINK_STABLE</span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="space-y-4 flex-grow">
        {messages.length === 0 && !streamingResponse && (
          <div className="text-center py-12 text-[#245830]">
            <p className="text-sm font-bold text-[#2ea84e] mb-1">
              * The veil between past and present is thin *
            </p>
            <p className="text-xs">
              Select a departed pioneer above or enter an invocation below.
            </p>
            <p className="text-[11px] mt-3 opacity-60">
              Type your technical dilemma or toggle "Transmute Code" to offer a modern code sacrifice.
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg border leading-relaxed ${
              msg.role === 'user'
                ? 'bg-[#08180c] border-[#1d4624] text-[#a4efb7] ml-6'
                : 'bg-[#0a200f] border-[#255e2f] text-[#33ff33] mr-6 crt-bloom'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-[#143219]/60 text-[10px] text-[#2ea84e]">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1">
                {msg.role === 'user' ? (
                  <>
                    <MessageSquare className="w-3 h-3 text-[#2ea84e]" />
                    <span>Petitioner (You)</span>
                  </>
                ) : (
                  <>
                    <span>{msg.spiritIcon || '👻'}</span>
                    <span>{msg.spiritName} ({msg.spiritEra})</span>
                  </>
                )}
              </span>

              {msg.role === 'spirit' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onPlayVoice(msg.content, msg.spiritId)}
                    disabled={audioLoading}
                    className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                    title="Speak message aloud"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Speak</span>
                  </button>
                  <button
                    onClick={() => handleCopy(msg.content, idx)}
                    className="hover:text-white transition-colors cursor-pointer"
                    title="Copy response"
                  >
                    {copiedIdx === idx ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              )}
            </div>

            {msg.codeSnippet && (
              <pre className="mb-2 p-2 bg-black/60 rounded border border-[#1b4324] text-[11px] text-[#70db8b] overflow-x-auto font-mono">
                {msg.codeSnippet}
              </pre>
            )}

            <div className="whitespace-pre-wrap font-sans text-xs sm:text-[13px] leading-relaxed">
              {msg.content}
            </div>
          </div>
        ))}

        {/* Live Streaming Response Chunk */}
        {isStreaming && (
          <div className="p-3 rounded-lg border bg-[#0a200f] border-[#22c55e] text-[#33ff33] mr-6 crt-bloom shadow-[0_0_15px_rgba(34,197,94,0.2)]">
            <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-[#143219]/60 text-[10px] text-[#2ea84e]">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1">
                <span>{currentSpirit?.icon || '👻'}</span>
                <span>{currentSpirit?.name}</span>
                <span className="text-[9px] px-1 py-0.2 bg-[#1b4324] rounded text-white animate-pulse">
                  TRANSMITTING...
                </span>
              </span>
            </div>
            <div className="whitespace-pre-wrap font-sans text-xs sm:text-[13px] leading-relaxed">
              {streamingResponse}
              <span className="inline-block w-2 h-4 ml-1 bg-[#33ff33] animate-pulse align-middle"></span>
            </div>
          </div>
        )}

        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}
