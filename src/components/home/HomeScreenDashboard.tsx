import React from 'react';
import { DIFFICULTY_LEVELS } from '../../data/gameConstants';
import { CharacterAvatar, GuideCharacter, MathTopic } from '../../types';
import { soundManager } from '../../utils/sound';
import { AvatarRenderer } from '../avatar/AvatarRenderer';
import { CharacterGuide } from '../common/CharacterGuide';

interface HomeScreenDashboardProps {
  playerName: string;
  avatar: CharacterAvatar;
  guideCharacterId: GuideCharacter['id'];
  level: number;
  stars: number;
  coins: number;
  streak: number;
  badgesCount: number;
  onPlayNow: () => void;
  onOpenMap: () => void;
  onOpenTrophies: () => void;
  onOpenProgress: () => void;
  onOpenShop: () => void;
  onOpenSettings: () => void;
  onOpenDaily: () => void;
  onOpenLeaderboard: () => void;
  onStartSpecific: (topic: MathTopic) => void;
}

export const HomeScreenDashboard: React.FC<HomeScreenDashboardProps> = ({
  playerName,
  avatar,
  guideCharacterId,
  level,
  stars,
  coins,
  streak,
  badgesCount,
  onPlayNow,
  onOpenMap,
  onOpenTrophies,
  onOpenProgress,
  onOpenShop,
  onOpenSettings,
  onOpenDaily,
  onOpenLeaderboard,
  onStartSpecific,
}) => {
  const currentDiff = DIFFICULTY_LEVELS.find((d) => d.level === level) || DIFFICULTY_LEVELS[1];

  return (
    <div className="relative min-h-[calc(100vh-70px)] pb-16 pt-4 px-3 sm:px-6 max-w-6xl mx-auto flex flex-col justify-between select-none">
      {/* Hero Welcome Banner */}
      <div className="text-center mt-2 sm:mt-4 mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border-2 border-amber-300 text-amber-900 text-xs sm:text-sm font-black mb-3 shadow-sm">
          <span>✨</span>
          <span>LEARN MATHS • PLAY GAMES • BECOME A MATHS HERO!</span>
          <span>✨</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-indigo-950 font-heading tracking-tight drop-shadow-sm leading-tight">
          MATHS <span className="text-rose-500">ADVENTURE</span>
        </h1>
        <p className="text-base sm:text-xl font-extrabold text-amber-800 mt-1">
          Play. Learn. Solve. Become a Maths Hero!
        </p>
      </div>

      {/* Main Interactive Stage Box: Avatar & Big Play */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-white/90 rounded-3xl p-6 sm:p-8 border-4 border-amber-200 shadow-2xl relative overflow-hidden backdrop-blur-xs">
        {/* Playful background decorative shapes */}
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-pink-100 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-amber-100 rounded-full blur-2xl pointer-events-none" />

        {/* Left: Player Avatar Centerpiece & Status */}
        <div className="lg:col-span-5 flex flex-col items-center text-center">
          <div className="relative p-3 bg-gradient-to-b from-amber-100 to-orange-100 rounded-full border-4 border-amber-300 shadow-lg mb-3">
            <AvatarRenderer avatar={avatar} size="xl" animated />
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenShop();
              }}
              className="absolute bottom-1 right-1 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black p-2.5 rounded-full border-2 border-white shadow-md active:scale-95 transition"
              title="Customize Wardrobe"
            >
              🎒
            </button>
          </div>

          <h3 className="text-2xl font-black text-slate-900 font-heading">
            {playerName}
          </h3>

          {/* Level Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-black text-indigo-900 mt-1 mb-3">
            <span>{currentDiff.badge}</span>
            <span>{currentDiff.name}</span>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-4 gap-2 w-full max-w-sm">
            <div className="bg-amber-50 p-2 rounded-xl border border-amber-200">
              <span className="text-base block">⭐</span>
              <span className="text-xs font-black text-slate-800">{stars}</span>
              <span className="text-[9px] font-extrabold text-amber-800 block">STARS</span>
            </div>
            <div className="bg-amber-50 p-2 rounded-xl border border-amber-200">
              <span className="text-base block">🪙</span>
              <span className="text-xs font-black text-slate-800">{coins}</span>
              <span className="text-[9px] font-extrabold text-amber-800 block">COINS</span>
            </div>
            <div className="bg-amber-50 p-2 rounded-xl border border-amber-200">
              <span className="text-base block">🔥</span>
              <span className="text-xs font-black text-slate-800">{streak}d</span>
              <span className="text-[9px] font-extrabold text-amber-800 block">STREAK</span>
            </div>
            <div className="bg-amber-50 p-2 rounded-xl border border-amber-200">
              <span className="text-base block">🎖️</span>
              <span className="text-xs font-black text-slate-800">{badgesCount}</span>
              <span className="text-[9px] font-extrabold text-amber-800 block">BADGES</span>
            </div>
          </div>
        </div>

        {/* Right: Big Action Controls */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-3 sm:space-y-4">
          {/* GIANT PLAY BUTTON */}
          <button
            onClick={() => {
              soundManager.playCelebration();
              onPlayNow();
            }}
            className="btn-3d w-full py-5 sm:py-6 px-6 rounded-3xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 hover:brightness-110 text-white font-black text-2xl sm:text-3xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition"
          >
            <span className="text-3xl sm:text-4xl">▶</span>
            <span>PLAY MATHS ADVENTURE!</span>
          </button>

          {/* Quick Menu Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenMap();
              }}
              className="btn-3d p-3.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-sm flex flex-col items-center justify-center gap-1 shadow-md hover:brightness-105 active:scale-95 transition"
            >
              <span className="text-2xl">🗺️</span>
              <span>ADVENTURE MAP</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onOpenProgress();
              }}
              className="btn-3d p-3.5 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-amber-950 font-black text-sm flex flex-col items-center justify-center gap-1 shadow-md hover:brightness-105 active:scale-95 transition"
            >
              <span className="text-2xl">⭐</span>
              <span>MY PROGRESS</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onOpenTrophies();
              }}
              className="btn-3d p-3.5 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 text-white font-black text-sm flex flex-col items-center justify-center gap-1 shadow-md hover:brightness-105 active:scale-95 transition"
            >
              <span className="text-2xl">🏆</span>
              <span>TROPHIES</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onOpenShop();
              }}
              className="btn-3d p-3.5 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white font-black text-sm flex flex-col items-center justify-center gap-1 shadow-md hover:brightness-105 active:scale-95 transition"
            >
              <span className="text-2xl">🎒</span>
              <span>REWARDS SHOP</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onOpenDaily();
              }}
              className="btn-3d p-3.5 rounded-2xl bg-gradient-to-br from-amber-300 to-yellow-400 text-amber-950 font-black text-sm flex flex-col items-center justify-center gap-1 shadow-md hover:brightness-105 active:scale-95 transition"
            >
              <span className="text-2xl">📜</span>
              <span>DAILY QUESTS</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onOpenSettings();
              }}
              className="btn-3d p-3.5 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 text-white font-black text-sm flex flex-col items-center justify-center gap-1 shadow-md hover:brightness-105 active:scale-95 transition"
            >
              <span className="text-2xl">⚙️</span>
              <span>SETTINGS</span>
            </button>
          </div>

          {/* Quick Topic Shortcuts */}
          <div className="pt-2">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
              Jump straight into a topic:
            </span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {[
                { id: 'addition', label: 'Addition', icon: '🍎' },
                { id: 'subtraction', label: 'Subtraction', icon: '🌲' },
                { id: 'multiplication', label: 'Times Tables', icon: '⛰️' },
                { id: 'division', label: 'Division', icon: '🏰' },
                { id: 'ratio', label: 'Ratios', icon: '🌊' },
                { id: 'percentage', label: 'Percentages', icon: '🏙️' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    soundManager.playClick();
                    onStartSpecific(item.id as MathTopic);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-black text-slate-800 flex items-center gap-1.5 active:scale-95 transition"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Guide Companion Bubble at bottom */}
      <div className="mt-6 flex justify-center sm:justify-start">
        <CharacterGuide
          guideId={guideCharacterId}
          speechText="Welcome back, Maths Hero! Ready to conquer new challenges today?"
        />
      </div>
    </div>
  );
};
