import React, { useEffect, useState, useRef } from 'react';
import { soundEngine } from '../utils/audio';

// Pre-calculated coordinates (percentages) for authentic arched Ouija layout
const LETTER_POSITIONS = {
  // Top Arc: A - M
  'A': { x: 12, y: 38 }, 'B': { x: 17, y: 32 }, 'C': { x: 23, y: 28 }, 'D': { x: 30, y: 25 },
  'E': { x: 37, y: 24 }, 'F': { x: 44, y: 23 }, 'G': { x: 51, y: 23 }, 'H': { x: 58, y: 24 },
  'I': { x: 65, y: 25 }, 'J': { x: 72, y: 28 }, 'K': { x: 78, y: 32 }, 'L': { x: 84, y: 38 },
  'M': { x: 89, y: 45 },
  // Bottom Arc: N - Z
  'N': { x: 14, y: 55 }, 'O': { x: 20, y: 50 }, 'P': { x: 26, y: 46 }, 'Q': { x: 33, y: 43 },
  'R': { x: 40, y: 41 }, 'S': { x: 48, y: 40 }, 'T': { x: 55, y: 40 }, 'U': { x: 62, y: 41 },
  'V': { x: 69, y: 43 }, 'W': { x: 76, y: 46 }, 'X': { x: 82, y: 50 }, 'Y': { x: 87, y: 55 },
  'Z': { x: 91, y: 62 },
  // Numbers
  '1': { x: 22, y: 72 }, '2': { x: 28, y: 72 }, '3': { x: 34, y: 72 }, '4': { x: 40, y: 72 },
  '5': { x: 46, y: 72 }, '6': { x: 52, y: 72 }, '7': { x: 58, y: 72 }, '8': { x: 64, y: 72 },
  '9': { x: 70, y: 72 }, '0': { x: 76, y: 72 },
  // Special Regions
  'YES': { x: 16, y: 14 },
  'NO': { x: 84, y: 14 },
  'GOODBYE': { x: 50, y: 88 },
  'REST': { x: 50, y: 50 }
};

export default function OuijaBoard({ activeToken, isStreaming, currentSpirit }) {
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const [activeChar, setActiveChar] = useState('');
  const lastTargetRef = useRef('REST');

  useEffect(() => {
    if (!activeToken || !isStreaming) {
      if (!isStreaming && lastTargetRef.current !== 'REST') {
        setTargetPos(LETTER_POSITIONS.REST);
        lastTargetRef.current = 'REST';
        setActiveChar('');
      }
      return;
    }

    // Determine target from token
    const cleanToken = activeToken.toUpperCase().replace(/[^A-Z0-9]/g, '');
    let targetKey = 'REST';

    if (cleanToken.includes('YES')) {
      targetKey = 'YES';
    } else if (cleanToken.includes('NO')) {
      targetKey = 'NO';
    } else if (cleanToken.length > 0) {
      const char = cleanToken[0];
      if (LETTER_POSITIONS[char]) {
        targetKey = char;
      }
    }

    if (targetKey !== lastTargetRef.current && LETTER_POSITIONS[targetKey]) {
      setTargetPos(LETTER_POSITIONS[targetKey]);
      setActiveChar(targetKey);
      lastTargetRef.current = targetKey;
      soundEngine.playPlanchetteSlide();
    }
  }, [activeToken, isStreaming]);

  const upperArc = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
  const lowerArc = ['N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <div className="relative w-full aspect-[16/9] max-h-[380px] bg-[#0c180f] border-2 border-[#1a3821] rounded-xl p-4 shadow-2xl overflow-hidden select-none">
      {/* Decorative Outer Arc Border */}
      <div className="absolute inset-2 border border-[#1e4627] rounded-lg pointer-events-none opacity-40"></div>
      <div className="absolute inset-3 border border-dashed border-[#14321b] rounded-lg pointer-events-none opacity-30"></div>

      {/* Sun & Moon Occult Seals */}
      <div className="absolute top-3 left-4 text-xs font-mono text-[#2ea84e] opacity-70 tracking-widest flex items-center gap-1">
        <span>☀️</span>
        <span className={`px-2 py-0.5 rounded border border-[#235832] ${activeChar === 'YES' ? 'bg-[#22c55e] text-black font-bold' : ''}`}>
          YES
        </span>
      </div>
      <div className="absolute top-3 right-4 text-xs font-mono text-[#2ea84e] opacity-70 tracking-widest flex items-center gap-1">
        <span className={`px-2 py-0.5 rounded border border-[#235832] ${activeChar === 'NO' ? 'bg-[#22c55e] text-black font-bold' : ''}`}>
          NO
        </span>
        <span>🌙</span>
      </div>

      {/* Center Mystic Header */}
      <div className="text-center mt-0.5">
        <div className="text-[10px] tracking-[0.3em] uppercase text-[#388e4e] font-serif">
          — Ethereal Oracle of Silicon & Spirit —
        </div>
        <div className="text-xs font-bold tracking-[0.4em] text-[#33ff33] crt-bloom uppercase">
          N E C R O • T E R M
        </div>
      </div>

      {/* Letter Arcs */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Upper Arc */}
        {upperArc.map(char => {
          const pos = LETTER_POSITIONS[char];
          const isLit = activeChar === char;
          return (
            <span
              key={char}
              className={`absolute font-serif text-sm font-bold transition-all duration-200 transform -translate-x-1/2 -translate-y-1/2 ${
                isLit ? 'text-[#00ff66] scale-150 crt-bloom font-extrabold z-10' : 'text-[#388e4e] opacity-60'
              }`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              {char}
            </span>
          );
        })}

        {/* Lower Arc */}
        {lowerArc.map(char => {
          const pos = LETTER_POSITIONS[char];
          const isLit = activeChar === char;
          return (
            <span
              key={char}
              className={`absolute font-serif text-sm font-bold transition-all duration-200 transform -translate-x-1/2 -translate-y-1/2 ${
                isLit ? 'text-[#00ff66] scale-150 crt-bloom font-extrabold z-10' : 'text-[#388e4e] opacity-60'
              }`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              {char}
            </span>
          );
        })}

        {/* Numbers Row */}
        {numbers.map(num => {
          const pos = LETTER_POSITIONS[num];
          const isLit = activeChar === num;
          return (
            <span
              key={num}
              className={`absolute font-mono text-xs transition-all duration-200 transform -translate-x-1/2 -translate-y-1/2 ${
                isLit ? 'text-[#00ff66] scale-150 crt-bloom font-bold z-10' : 'text-[#2a6d3c] opacity-50'
              }`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              {num}
            </span>
          );
        })}

        {/* Goodbye Footer */}
        <div 
          className="absolute left-1/2 bottom-3 -translate-x-1/2 text-xs font-serif tracking-[0.25em] text-[#33a852] opacity-70 border-t border-[#1e4627] pt-1 px-6 uppercase"
        >
          G O O D • B Y E
        </div>
      </div>

      {/* The Animated Planchette */}
      <div
        className="absolute pointer-events-none transition-all duration-300 ease-out z-20"
        style={{
          left: `${targetPos.x}%`,
          top: `${targetPos.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="relative w-14 h-16 flex items-center justify-center">
          {/* Planchette Wooden Teardrop Shape */}
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            <path
              d="M 50 5 C 20 5, 5 35, 5 70 C 5 95, 25 115, 50 115 C 75 115, 95 95, 95 70 C 95 35, 80 5, 50 5 Z"
              fill="#182c1e"
              stroke="#22c55e"
              strokeWidth="3"
            />
            {/* Inner mystical engraved rune */}
            <circle cx="50" cy="55" r="18" fill="none" stroke="#2ea84e" strokeWidth="1.5" strokeDasharray="3 3" />
            {/* Center Viewing Glass Lens */}
            <circle cx="50" cy="55" r="14" fill="rgba(51, 255, 51, 0.15)" stroke="#33ff33" strokeWidth="2" />
          </svg>

          {/* Glowing Aura when active */}
          {isStreaming && (
            <div className="absolute inset-0 rounded-full bg-[#22c55e]/20 blur-md animate-pulse"></div>
          )}

          {/* Active Letter Manifestation inside Lens */}
          <span className="absolute top-[40%] text-xs font-mono font-black text-[#00ff66] crt-bloom drop-shadow">
            {activeChar}
          </span>
        </div>
      </div>
    </div>
  );
}
