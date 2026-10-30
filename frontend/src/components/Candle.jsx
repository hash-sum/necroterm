import React from 'react';
import { Flame, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export default function Candle({ candleLife, onRelight }) {
  const isExtinguished = candleLife <= 0;

  const handleIgnite = () => {
    soundEngine.playIgniteSound();
    onRelight();
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[#09150b] border border-[#1b3d22] rounded-xl p-3 shadow-lg select-none min-w-[120px]">
      <div className="text-[10px] uppercase tracking-widest text-[#2ea84e] mb-2 font-mono flex items-center gap-1">
        <Flame className="w-3 h-3 text-orange-400" />
        <span>Vessel Life</span>
      </div>

      {/* The Animated Candle Graphic */}
      <div className="relative h-28 w-12 flex flex-col items-center justify-end">
        {/* Flame (visible only if not extinguished) */}
        {!isExtinguished ? (
          <div className="relative mb-0.5">
            {/* Outer halo */}
            <div className="absolute -inset-2 bg-orange-500/20 rounded-full blur-md animate-pulse"></div>
            {/* Flickering teardrop flame */}
            <div className="w-4 h-7 bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 rounded-full animate-flame shadow-[0_0_12px_#ff9900]"></div>
            {/* Wick */}
            <div className="w-0.5 h-2 bg-neutral-900 mx-auto -mt-1"></div>
          </div>
        ) : (
          <div className="mb-2 text-neutral-600 text-xs font-mono italic animate-pulse">
            *wisp*
          </div>
        )}

        {/* Wax Pillar (shrinks dynamically with candleLife) */}
        <div
          className={`w-7 rounded-t-sm border border-neutral-700 transition-all duration-700 ease-out flex flex-col justify-between ${
            isExtinguished 
              ? 'bg-neutral-800 border-neutral-700' 
              : 'bg-gradient-to-r from-amber-100 via-amber-50 to-amber-200'
          }`}
          style={{ height: `${Math.max(14, (candleLife / 100) * 65)}px` }}
        >
          {/* Melted wax drips */}
          <div className="w-full h-1 bg-amber-300/40 rounded-full"></div>
        </div>

        {/* Candle Brass Base */}
        <div className="w-10 h-2 bg-yellow-900 border border-yellow-700 rounded-t-sm"></div>
      </div>

      {/* Percentage / Status */}
      <div className="mt-2 text-center">
        {!isExtinguished ? (
          <div className="text-xs font-mono font-bold text-amber-400">
            {candleLife}% <span className="text-[10px] text-neutral-400 font-normal">flame</span>
          </div>
        ) : (
          <button
            onClick={handleIgnite}
            className="mt-1 px-2.5 py-1 text-[11px] font-mono bg-orange-600 hover:bg-orange-500 text-black font-bold rounded flex items-center gap-1 shadow-lg cursor-pointer transition-transform active:scale-95"
            title="Strike a match to relight the connection"
          >
            <Sparkles className="w-3 h-3" /> Relight
          </button>
        )}
      </div>
    </div>
  );
}
