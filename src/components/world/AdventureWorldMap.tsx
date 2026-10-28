import React, { useState } from 'react';
import { REALMS } from '../../data/gameConstants';
import { GameMode, MathTopic } from '../../types';
import { soundManager } from '../../utils/sound';

interface AdventureWorldMapProps {
  realmProgress: Record<MathTopic, number[]>;
  onStartGame: (topic: MathTopic, mode: GameMode, levelIndex: number) => void;
  onOpenQuickPlay: () => void;
  onOpenDaily: () => void;
}

export const AdventureWorldMap: React.FC<AdventureWorldMapProps> = ({
  realmProgress,
  onStartGame,
  onOpenQuickPlay,
  onOpenDaily,
}) => {
  const [selectedRealm, setSelectedRealm] = useState<MathTopic | null>(null);

  const activeRealmConfig = REALMS.find((r) => r.id === selectedRealm);

  const handleRealmClick = (topic: MathTopic) => {
    soundManager.playClick();
    setSelectedRealm(topic);
  };

  return (
    <div className="relative min-h-[calc(100vh-70px)] pb-20 pt-6 px-3 sm:px-6">
      {/* Cartoon World Map Title Header */}
      <div className="max-w-6xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-white/90 border-3 border-amber-300 px-5 py-2 rounded-full shadow-md mb-2 animate-bounce">
          <span className="text-2xl">🗺️</span>
          <span className="text-xs sm:text-sm font-black text-amber-900 tracking-wide uppercase">
            Interactive Mathematical Realm Map
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-indigo-950 font-heading tracking-tight drop-shadow-sm">
          Where will you explore today?
        </h2>
        <p className="text-sm sm:text-base font-bold text-slate-600 max-w-xl mx-auto mt-1">
          Choose a realm, solve exciting cartoon challenges, rescue animals, and earn stars!
        </p>

        {/* Quick Launch Action Ribbon */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4">
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenQuickPlay();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-sm shadow-md hover:brightness-110 active:scale-95 transition"
          >
            <span>▶</span>
            <span>Quick Play</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onStartGame('addition', 'number-race', 0);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-sm shadow-md hover:brightness-110 active:scale-95 transition"
          >
            <span>🏎️</span>
            <span>Number Race</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onStartGame('multiplication', 'time-challenge', 0);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-sm shadow-md hover:brightness-110 active:scale-95 transition"
          >
            <span>⏱️</span>
            <span>Time Challenge</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onStartGame('addition', 'memory', 0);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-sm shadow-md hover:brightness-110 active:scale-95 transition"
          >
            <span>🎴</span>
            <span>Memory Match</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenDaily();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border-2 border-amber-300 text-amber-900 font-black text-sm shadow-md hover:bg-amber-50 active:scale-95 transition"
          >
            <span>📜</span>
            <span>Daily Quests</span>
          </button>
        </div>
      </div>

      {/* The 6 Cartoon Realms Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {REALMS.map((realm) => {
          const starsList = realmProgress[realm.id] || [0, 0, 0, 0, 0];
          const completedCount = starsList.filter((s) => s > 0).length;
          const totalStars = starsList.reduce((acc, curr) => acc + curr, 0);

          return (
            <div
              key={realm.id}
              className="group relative bg-white rounded-3xl p-6 border-4 border-amber-200 shadow-xl hover:shadow-2xl hover:border-amber-300 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle realm color banner top */}
              <div
                className={`absolute top-0 left-0 right-0 h-3 bg-gradient-to-r ${realm.bgGradient}`}
              />

              <div>
                {/* Realm Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">
                    {realm.icon}
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-100 text-yellow-900 px-3 py-1 rounded-full text-xs font-black border border-yellow-300 shadow-xs">
                    <span>⭐</span>
                    <span>{totalStars} / 15 Stars</span>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-900 font-heading leading-tight group-hover:text-indigo-600 transition-colors">
                  {realm.name}
                </h3>
                <p className="text-xs font-bold text-slate-500 mb-2">
                  {realm.subtitle}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 line-clamp-2 leading-relaxed">
                  {realm.description}
                </p>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-black text-slate-600 mb-1">
                    <span>Area Progress</span>
                    <span>{completedCount} / 5 Stages</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3.5 p-0.5 border border-slate-200">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${realm.bgGradient} transition-all duration-500`}
                      style={{ width: `${(completedCount / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Enter Realm Button */}
              <button
                type="button"
                onClick={() => handleRealmClick(realm.id)}
                className="btn-3d mt-5 w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-black text-base shadow-md flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <span>Enter Realm 🗺️</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Stage Selection Modal */}
      {selectedRealm && activeRealmConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-pop-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => {
                soundManager.playClick();
                setSelectedRealm(null);
              }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black flex items-center justify-center transition"
            >
              ✕
            </button>

            {/* Realm Header in Modal */}
            <div className="text-center mb-6">
              <span className="text-5xl">{activeRealmConfig.icon}</span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mt-2">
                {activeRealmConfig.name}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-slate-500">
                Choose a stage to play or challenge the area boss!
              </p>
            </div>

            {/* Stages List (1 to 5) */}
            <div className="space-y-3">
              {[0, 1, 2, 3, 4].map((stageIdx) => {
                const starsWon = (realmProgress[selectedRealm] || [])[stageIdx] || 0;
                const isLocked = stageIdx > 0 && (realmProgress[selectedRealm] || [])[stageIdx - 1] === 0;
                const isBossStage = stageIdx === 4;

                return (
                  <div
                    key={stageIdx}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 transition-all ${
                      isLocked
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : isBossStage
                        ? 'bg-purple-50 border-purple-300 shadow-xs'
                        : 'bg-amber-50/70 border-amber-200 hover:border-amber-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-black ${
                          isLocked
                            ? 'bg-slate-200 text-slate-500'
                            : isBossStage
                            ? 'bg-purple-600 text-white'
                            : 'bg-amber-400 text-amber-950'
                        }`}
                      >
                        {isLocked ? '🔒' : isBossStage ? '👾' : stageIdx + 1}
                      </div>

                      <div>
                        <h4 className="text-sm sm:text-base font-black text-slate-800">
                          {isBossStage ? `Stage 5: Boss Battle!` : `Stage ${stageIdx + 1}`}
                        </h4>
                        <div className="flex items-center gap-1 text-xs">
                          {Array.from({ length: 3 }, (_, s) => (
                            <span
                              key={s}
                              className={s < starsWon ? 'text-amber-500' : 'text-slate-300'}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isLocked}
                      onClick={() => {
                        soundManager.playClick();
                        setSelectedRealm(null);
                        onStartGame(
                          selectedRealm,
                          isBossStage ? 'boss-battle' : 'adventure',
                          stageIdx
                        );
                      }}
                      className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm active:scale-95 transition shadow-xs ${
                        isLocked
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : isBossStage
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      }`}
                    >
                      {isLocked ? 'Locked' : isBossStage ? 'Fight Boss! ⚔️' : 'Play ▶'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Quick Practice shortcut in realm */}
            <div className="mt-5 pt-4 border-t-2 border-slate-100 flex gap-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setSelectedRealm(null);
                  onStartGame(selectedRealm, 'time-challenge', 0);
                }}
                className="flex-1 py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 font-extrabold text-xs text-center hover:bg-indigo-100 transition"
              >
                ⏱️ 60s Blitz
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setSelectedRealm(null);
                  onStartGame(selectedRealm, 'number-race', 0);
                }}
                className="flex-1 py-2.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 font-extrabold text-xs text-center hover:bg-orange-100 transition"
              >
                🏎️ Number Race
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
