import React from 'react';
import { Sparkles, Terminal, Volume2 } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export default function SpiritSelector({ spirits, currentSpirit, onSelectSpirit, onSampleClick, disabled }) {
  const handleSelect = (spirit) => {
    if (disabled || spirit.id === currentSpirit?.id) return;
    soundEngine.playSpiritChime(spirit.ambient_freq || 440);
    onSelectSpirit(spirit);
  };

  return (
    <div className="bg-[#08130a] border border-[#18391f] rounded-xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3 border-b border-[#14321a] pb-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#2ea84e]" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#33ff33]">
            Spectral Pantheon
          </h2>
        </div>
        <span className="text-[10px] font-mono text-[#2ea84e] opacity-75">
          Gemma 2 Open-Weights
        </span>
      </div>

      {/* Spirit Badges List */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-3">
        {spirits.map((s) => {
          const isSelected = s.id === currentSpirit?.id;
          return (
            <button
              key={s.id}
              onClick={() => handleSelect(s)}
              disabled={disabled}
              className={`p-2 rounded-lg border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#123819] border-[#22c55e] shadow-[0_0_12px_rgba(34,197,94,0.3)]'
                  : 'bg-[#0a1a0d] border-[#16381e] hover:border-[#22c55e]/50 opacity-70 hover:opacity-100'
              } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg">{s.icon}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-[#2ea84e] border border-[#1b4324]">
                  {s.era}
                </span>
              </div>
              <div className="text-xs font-bold text-white truncate">{s.name.split(' ')[0]}</div>
              <div className="text-[10px] text-[#22c55e] truncate opacity-80">{s.title.split(' ')[0]}</div>
            </button>
          );
        })}
      </div>

      {/* Current Spirit Dossier */}
      {currentSpirit && (
        <div className="bg-[#0b1f10] border border-[#1d4624] rounded-lg p-3 text-xs">
          <div className="flex items-center justify-between mb-1">
            <div className="font-bold text-[#33ff33] text-sm flex items-center gap-2">
              <span>{currentSpirit.icon}</span>
              <span>{currentSpirit.name}</span>
              <span className="text-xs font-normal text-[#2ea84e]">({currentSpirit.era})</span>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#16381e] text-[#48c76c]">
              {currentSpirit.title}
            </span>
          </div>

          <p className="text-[#a1e3b3] text-xs leading-relaxed mb-3 font-sans opacity-90">
            {currentSpirit.description}
          </p>

          {/* Sample Invocations */}
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#2ea84e] font-mono mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#33ff33]" />
              <span>Prompt Invocations:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentSpirit.sample_prompts?.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onSampleClick(prompt)}
                  disabled={disabled}
                  className="text-[11px] text-left px-2 py-1 rounded bg-[#071408] border border-[#1c4723] hover:border-[#33ff33] text-[#2ea84e] hover:text-[#33ff33] transition-colors cursor-pointer"
                >
                  "{prompt.length > 55 ? prompt.slice(0, 52) + '...' : prompt}"
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
