import React from 'react';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/sound';
import { AvatarRenderer } from '../avatar/AvatarRenderer';
import { PWAInstallButton } from './PWAInstallButton';
import { SyncStatusIndicator } from './SyncStatusIndicator';

interface HeaderProps {
  onOpenShop: () => void;
  onOpenProgress: () => void;
  onOpenSettings: () => void;
  onOpenParent: () => void;
  onOpenDaily: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenShop,
  onOpenProgress,
  onOpenSettings,
  onOpenParent,
  onOpenDaily,
  onGoHome,
}) => {
  const {
    playerName,
    avatar,
    level,
    stars,
    coins,
    streak,
    settings,
    updateSettings,
    dailyQuests,
  } = useGame();

  const handleSoundToggle = () => {
    const nextVal = !settings.soundEnabled;
    updateSettings({ soundEnabled: nextVal });
    soundManager.setEnabled(nextVal);
    if (nextVal) {
      soundManager.playSparkle();
    }
  };

  const pendingQuestsCount = dailyQuests.filter((q) => q.completed).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-4 border-amber-200 px-3 py-2 sm:px-6 shadow-sm select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & Brand */}
        <button
          onClick={() => {
            soundManager.playClick();
            onGoHome();
          }}
          className="flex items-center gap-2 group text-left transition-transform active:scale-95"
          title="Back to Home Dashboard"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-md group-hover:rotate-6 transition-transform">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-xl sm:text-2xl">
              ⭐
            </div>
          </div>
          <div className="hidden min-[380px]:block">
            <h1 className="text-lg sm:text-2xl font-black tracking-tight text-indigo-900 leading-none font-heading flex items-center gap-1">
              MATHS <span className="text-pink-500">ADVENTURE</span>
            </h1>
            <p className="text-[10px] sm:text-xs font-bold text-amber-700 tracking-wide">
              PLAY • LEARN • SOLVE
            </p>
          </div>
        </button>

        {/* Currency & Stats pills */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Daily Quests button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenDaily();
            }}
            className="relative flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-900 px-2.5 py-1.5 rounded-full text-xs sm:text-sm font-black border border-amber-300 shadow-xs active:scale-95 transition"
            title="Daily Challenges"
          >
            <span>📜</span>
            <span className="hidden sm:inline">Daily</span>
            {pendingQuestsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold animate-pulse">
                {pendingQuestsCount}
              </span>
            )}
          </button>

          {/* Stars Pill */}
          <div
            className="flex items-center gap-1 bg-yellow-50 border border-yellow-300 px-2.5 py-1 rounded-full text-xs sm:text-sm font-black text-amber-800 shadow-xs"
            title={`${stars} Total Stars`}
          >
            <span className="text-sm sm:text-base animate-wiggle">⭐</span>
            <span>{stars}</span>
          </div>

          {/* Coins Pill */}
          <div
            className="flex items-center gap-1 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-full text-xs sm:text-sm font-black text-amber-900 shadow-xs"
            title={`${coins} Gold Coins`}
          >
            <span className="text-sm sm:text-base animate-coin-bounce">🪙</span>
            <span>{coins}</span>
          </div>

          {/* Streak Flame */}
          <div
            className="hidden md:flex items-center gap-1 bg-orange-50 border border-orange-300 px-2.5 py-1 rounded-full text-xs sm:text-sm font-black text-orange-900 shadow-xs"
            title={`${streak} Day Streak!`}
          >
            <span className="text-sm sm:text-base">🔥</span>
            <span>{streak}d</span>
          </div>

          {/* Cloud & Local Service Worker Sync Status */}
          <SyncStatusIndicator />

          {/* PWA Install Button */}
          <PWAInstallButton variant="header" />

          {/* Sound Toggle */}
          <button
            onClick={handleSoundToggle}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-lg border transition-all active:scale-95 shadow-xs ${
              settings.soundEnabled
                ? 'bg-purple-100 border-purple-300 text-purple-800 hover:bg-purple-200'
                : 'bg-slate-100 border-slate-300 text-slate-400 hover:bg-slate-200'
            }`}
            title={settings.soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          >
            {settings.soundEnabled ? '🔊' : '🔇'}
          </button>

          {/* Avatar Profile / Shop Trigger */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenShop();
            }}
            className="flex items-center gap-1.5 p-1 rounded-full bg-indigo-50 border-2 border-indigo-200 hover:bg-indigo-100 active:scale-95 transition-all shadow-xs"
            title={`Customize ${playerName}'s Avatar & Gear`}
          >
            <AvatarRenderer avatar={avatar} size="sm" />
            <div className="hidden lg:block text-left pr-2">
              <p className="text-xs font-black text-indigo-950 leading-tight">
                {playerName}
              </p>
              <p className="text-[10px] font-bold text-indigo-600">
                Lvl {level}
              </p>
            </div>
          </button>

          {/* Parent / Teacher Gateway */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenParent();
            }}
            className="hidden sm:flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-sm font-bold shadow-xs active:scale-95 transition"
            title="Parent & Teacher Dashboard"
          >
            👨‍🏫
          </button>

          {/* Settings */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenSettings();
            }}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-base shadow-xs active:scale-95 transition"
            title="Settings & Accessibility"
          >
            ⚙️
          </button>
        </div>
      </div>
    </header>
  );
};
