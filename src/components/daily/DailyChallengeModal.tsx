import React, { useState } from 'react';
import { DailyQuest } from '../../types';
import { fireCelebrationConfetti, fireStarBurst } from '../../utils/confetti';
import { soundManager } from '../../utils/sound';

interface DailyChallengeModalProps {
  quests: DailyQuest[];
  onClaimQuest: (questId: string) => void;
  onClose: () => void;
  onOpenMysteryBox: () => void;
  coins: number;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  quests,
  onClaimQuest,
  onClose,
  onOpenMysteryBox,
  coins,
}) => {
  const [chestOpened, setChestOpened] = useState(false);
  const [chestPrize, setChestPrize] = useState<{ text: string; icon: string } | null>(null);

  const handleOpenChest = () => {
    if (chestOpened) return;
    soundManager.playSparkle();
    fireCelebrationConfetti();
    setChestOpened(true);
    setChestPrize({
      text: 'Surprise! +40 Gold Coins 🪙 & +3 Rainbow Stars ⭐!',
      icon: '💎',
    });
    onOpenMysteryBox();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-pop-in select-none">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center transition"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="text-4xl mb-1">📜</div>
          <h3 className="text-2xl font-black text-slate-900 font-heading">
            Daily Mathematical Quests
          </h3>
          <p className="text-xs font-bold text-slate-500">
            Fresh daily challenges reset every day! Complete missions for coins and stars!
          </p>
        </div>

        {/* Quests List */}
        <div className="space-y-3 mb-6">
          {quests.map((q) => {
            const isFinished = q.currentCount >= q.targetCount;

            return (
              <div
                key={q.id}
                className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 transition ${
                  q.completed
                    ? 'bg-emerald-50 border-emerald-300'
                    : 'bg-amber-50/50 border-amber-200'
                }`}
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-800">
                    {q.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-extrabold text-slate-500">
                      Progress: {Math.min(q.currentCount, q.targetCount)} / {q.targetCount}
                    </span>
                    <span className="text-[11px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      +{q.rewardCoins} 🪙 | +{q.rewardStars} ⭐
                    </span>
                  </div>
                </div>

                {q.completed ? (
                  <button
                    onClick={() => {
                      soundManager.playCelebration();
                      fireStarBurst();
                      onClaimQuest(q.id);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs shadow-md animate-bounce active:scale-95 transition"
                  >
                    Claim! 🎁
                  </button>
                ) : (
                  <span className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-600 font-black text-xs">
                    In Progress
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Daily Mystery Chest */}
        <div className="bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100 border-3 border-amber-300 rounded-3xl p-4 sm:p-5 text-center shadow-inner">
          <h4 className="text-sm font-black text-amber-950 uppercase tracking-wide mb-1">
            🎁 Daily Mystery Chest
          </h4>
          <p className="text-xs font-bold text-amber-800 mb-3">
            Open your daily mystery reward box!
          </p>

          {!chestOpened ? (
            <button
              onClick={handleOpenChest}
              className="py-3 px-6 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-black text-sm rounded-2xl shadow-lg border-2 border-white animate-wiggle active:scale-95 transition"
            >
              Open Chest! 🗝️
            </button>
          ) : (
            <div className="p-3 bg-white/90 rounded-2xl border-2 border-amber-300 animate-pop-in">
              <span className="text-3xl block mb-1">{chestPrize?.icon}</span>
              <p className="text-xs sm:text-sm font-black text-emerald-700">
                {chestPrize?.text}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="mt-6 w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-black text-xs rounded-2xl shadow-md transition"
        >
          Back to Adventure!
        </button>
      </div>
    </div>
  );
};
