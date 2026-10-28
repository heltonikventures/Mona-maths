import React from 'react';
import { REALMS } from '../../data/gameConstants';
import { BadgeItem, UserStats } from '../../types';
import { soundManager } from '../../utils/sound';

interface ProgressDashboardProps {
  stats: UserStats;
  badges: BadgeItem[];
  level: number;
  stars: number;
  coins: number;
  streak: number;
  onClose: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  stats,
  badges,
  level,
  stars,
  coins,
  streak,
  onClose,
}) => {
  const accuracy =
    stats.totalAnswered > 0
      ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
      : 100;

  const calculateTopicMastery = (score: number, answered: number) => {
    if (answered === 0) return 20; // baseline exploratory progress
    return Math.min(100, Math.max(15, Math.round((score / answered) * 100)));
  };

  const minutesSpent = Math.max(1, Math.round(stats.timeSpentSeconds / 60));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-pop-in select-none">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-2xl relative max-h-[92vh] flex flex-col">
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

        {/* Header */}
        <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-3xl">
            ⭐
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
              My Maths Adventure Progress
            </h3>
            <p className="text-xs font-bold text-slate-500">
              Track your mathematical mastery, badges, and learning journey!
            </p>
          </div>
        </div>

        {/* Top Stats Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-6">
          <div className="bg-amber-50 rounded-2xl p-3 border-2 border-amber-200 text-center">
            <span className="text-xl block">🎯</span>
            <span className="text-lg font-black text-slate-800">{accuracy}%</span>
            <span className="text-[10px] font-extrabold text-amber-800 uppercase block">Accuracy</span>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-3 border-2 border-emerald-200 text-center">
            <span className="text-xl block">📝</span>
            <span className="text-lg font-black text-slate-800">{stats.totalAnswered}</span>
            <span className="text-[10px] font-extrabold text-emerald-800 uppercase block">Answered</span>
          </div>

          <div className="bg-orange-50 rounded-2xl p-3 border-2 border-orange-200 text-center">
            <span className="text-xl block">🔥</span>
            <span className="text-lg font-black text-slate-800">{streak} Days</span>
            <span className="text-[10px] font-extrabold text-orange-800 uppercase block">Streak</span>
          </div>

          <div className="bg-indigo-50 rounded-2xl p-3 border-2 border-indigo-200 text-center">
            <span className="text-xl block">⏱️</span>
            <span className="text-lg font-black text-slate-800">{minutesSpent} min</span>
            <span className="text-[10px] font-extrabold text-indigo-800 uppercase block">Learning Time</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          {/* Topic Mastery Bars Section */}
          <div>
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <span>📊</span>
              <span>Topic Mastery Ratings</span>
            </h4>

            <div className="space-y-3">
              {REALMS.map((r) => {
                const topicScore = stats[`${r.id}Score` as keyof UserStats] as number;
                const topicAnswered = stats[`${r.id}Answered` as keyof UserStats] as number;
                const mastery = calculateTopicMastery(topicScore, topicAnswered);

                return (
                  <div key={r.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div className="flex justify-between items-center text-xs font-black text-slate-800 mb-1">
                      <span className="flex items-center gap-1.5">
                        <span>{r.icon}</span>
                        <span>{r.name}</span>
                      </span>
                      <span className="font-extrabold text-slate-600">{mastery}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-3 p-0.5">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${r.bgGradient} transition-all duration-500`}
                        style={{ width: `${mastery}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges Collection Section */}
          <div>
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <span>🎖️</span>
              <span>Badges & Trophies Earned ({badges.filter((b) => b.unlockedAt).length} / {badges.length})</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {badges.map((badge) => {
                const isUnlocked = !!badge.unlockedAt;

                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 transition ${
                      isUnlocked
                        ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                        : 'bg-slate-50 border-slate-200 opacity-50 grayscale'
                    }`}
                  >
                    <span className="text-3xl shrink-0">{badge.icon}</span>
                    <div className="min-w-0">
                      <h5 className="text-xs font-black text-slate-800 truncate">
                        {badge.title}
                      </h5>
                      <p className="text-[10px] font-semibold text-slate-500 line-clamp-1">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Close Button Bottom */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="mt-4 w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-black text-sm rounded-2xl shadow-md transition active:scale-95"
        >
          Close Dashboard
        </button>
      </div>
    </div>
  );
};
