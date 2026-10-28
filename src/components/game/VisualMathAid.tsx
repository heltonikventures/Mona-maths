import React, { useState } from 'react';
import { VisualAidData } from '../../types';
import { soundManager } from '../../utils/sound';

interface VisualMathAidProps {
  data: VisualAidData;
  className?: string;
}

export const VisualMathAid: React.FC<VisualMathAidProps> = ({ data, className = '' }) => {
  const [tappedIndices, setTappedIndices] = useState<Set<number>>(new Set());

  const handleItemTap = (idx: number) => {
    soundManager.playClick();
    setTappedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  if (data.type === 'fruit') {
    const emoji = data.itemEmoji || '🍎';
    const countA = data.countA || 0;
    const countB = data.countB || 0;

    return (
      <div className={`bg-amber-100/70 border-3 border-amber-300 rounded-3xl p-4 sm:p-5 text-center shadow-inner ${className}`}>
        <p className="text-xs sm:text-sm font-black text-amber-900 mb-2 uppercase tracking-wide">
          Tap items to count together!
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          {/* Group A */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-3 bg-white/80 rounded-2xl border-2 border-amber-200 shadow-xs">
            {Array.from({ length: countA }, (_, i) => {
              const isTapped = tappedIndices.has(i);
              return (
                <button
                  key={`a-${i}`}
                  type="button"
                  onClick={() => handleItemTap(i)}
                  className={`text-2xl sm:text-3xl transition-transform hover:scale-125 active:scale-95 ${
                    isTapped ? 'scale-110 opacity-70 filter drop-shadow' : ''
                  }`}
                  title={`Item ${i + 1}`}
                >
                  {emoji}
                </button>
              );
            })}
            <span className="ml-1 text-sm font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
              {countA}
            </span>
          </div>

          {countB > 0 && (
            <>
              <div className="text-2xl sm:text-3xl font-black text-amber-700">+</div>

              {/* Group B */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 p-3 bg-white/80 rounded-2xl border-2 border-amber-200 shadow-xs">
                {Array.from({ length: countB }, (_, i) => {
                  const globalIdx = countA + i;
                  const isTapped = tappedIndices.has(globalIdx);
                  return (
                    <button
                      key={`b-${i}`}
                      type="button"
                      onClick={() => handleItemTap(globalIdx)}
                      className={`text-2xl sm:text-3xl transition-transform hover:scale-125 active:scale-95 ${
                        isTapped ? 'scale-110 opacity-70 filter drop-shadow' : ''
                      }`}
                      title={`Item ${countA + i + 1}`}
                    >
                      {emoji}
                    </button>
                  );
                })}
                <span className="ml-1 text-sm font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  {countB}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (data.type === 'grid100') {
    const shaded = data.gridShaded || 50;

    return (
      <div className={`bg-rose-50 border-3 border-rose-200 rounded-3xl p-4 sm:p-5 shadow-inner text-center ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-black text-rose-900 uppercase">
            100-Square Percentage Visualizer
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-rose-600 bg-rose-100 px-2.5 py-0.5 rounded-full">
            {shaded} / 100 Squares
          </span>
        </div>

        {/* 10x10 Grid */}
        <div className="grid grid-cols-10 gap-1 w-52 sm:w-64 mx-auto p-2 bg-white rounded-2xl border-2 border-rose-300 shadow-sm">
          {Array.from({ length: 100 }, (_, i) => {
            const isFilled = i < shaded;
            return (
              <div
                key={i}
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-[3px] transition-colors ${
                  isFilled
                    ? 'bg-gradient-to-br from-rose-500 to-pink-500 shadow-xs'
                    : 'bg-slate-100 border border-slate-200'
                }`}
                title={`Square ${i + 1}`}
              />
            );
          })}
        </div>

        <p className="mt-2 text-xs font-bold text-slate-500">
          Each square is 1% of the whole power grid!
        </p>
      </div>
    );
  }

  if (data.type === 'array') {
    const rows = data.rows || 3;
    const cols = data.cols || 4;
    const emoji = data.itemEmoji || '⭐';

    return (
      <div className={`bg-indigo-50 border-3 border-indigo-200 rounded-3xl p-4 sm:p-5 shadow-inner text-center ${className}`}>
        <p className="text-xs sm:text-sm font-black text-indigo-900 mb-2 uppercase">
          Multiplication Array: {rows} Rows of {cols} Items
        </p>

        <div className="inline-flex flex-col gap-1.5 p-3 bg-white/90 rounded-2xl border-2 border-indigo-300 shadow-sm">
          {Array.from({ length: rows }, (_, r) => (
            <div key={`row-${r}`} className="flex items-center gap-1.5 justify-center">
              {Array.from({ length: cols }, (_, c) => (
                <span
                  key={`item-${r}-${c}`}
                  className="text-xl sm:text-2xl hover:scale-125 transition-transform"
                >
                  {emoji}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.type === 'sharing') {
    const groups = data.groups || 3;
    const perGroup = data.itemsPerGroup || 4;
    const emoji = data.itemEmoji || '🪙';
    const remainder = data.remainder || 0;

    return (
      <div className={`bg-purple-50 border-3 border-purple-200 rounded-3xl p-4 sm:p-5 shadow-inner text-center ${className}`}>
        <p className="text-xs sm:text-sm font-black text-purple-900 mb-2 uppercase">
          Fair Share: {groups} Equal Groupings
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {Array.from({ length: groups }, (_, g) => (
            <div
              key={`grp-${g}`}
              className="flex flex-col items-center bg-white p-3 rounded-2xl border-2 border-purple-300 shadow-sm min-w-[70px]"
            >
              <div className="flex flex-wrap gap-1 justify-center max-w-[90px]">
                {Array.from({ length: perGroup }, (_, i) => (
                  <span key={i} className="text-xl sm:text-2xl">
                    {emoji}
                  </span>
                ))}
              </div>
              <span className="mt-1 text-[11px] font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                Friend {g + 1}
              </span>
            </div>
          ))}
        </div>

        {remainder > 0 && (
          <div className="mt-2 text-xs font-black text-amber-700 bg-amber-100 inline-block px-3 py-1 rounded-full border border-amber-300">
            Leftover Remainder: {remainder} {emoji}
          </div>
        )}
      </div>
    );
  }

  if (data.type === 'ratio-bars') {
    const ratioA = data.ratioA || { label: 'Blue', count: 3, color: '#3B82F6', emoji: '🔵' };
    const ratioB = data.ratioB || { label: 'Red', count: 2, color: '#EF4444', emoji: '🔴' };

    return (
      <div className={`bg-sky-50 border-3 border-sky-200 rounded-3xl p-4 sm:p-5 shadow-inner text-center ${className}`}>
        <p className="text-xs sm:text-sm font-black text-sky-900 mb-3 uppercase">
          Visual Ratio Comparison
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
          {/* Side A */}
          <div className="bg-white p-3 rounded-2xl border-2 border-sky-300 shadow-sm">
            <span className="text-xs font-black text-slate-700 mb-1 block">
              {ratioA.label} ({ratioA.count})
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1">
              {Array.from({ length: ratioA.count }, (_, i) => (
                <span key={i} className="text-2xl">
                  {ratioA.emoji}
                </span>
              ))}
            </div>
          </div>

          {/* Side B */}
          <div className="bg-white p-3 rounded-2xl border-2 border-sky-300 shadow-sm">
            <span className="text-xs font-black text-slate-700 mb-1 block">
              {ratioB.label} ({ratioB.count})
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1">
              {Array.from({ length: ratioB.count }, (_, i) => (
                <span key={i} className="text-2xl">
                  {ratioB.emoji}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
