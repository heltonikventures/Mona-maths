import React, { useState } from 'react';
import { DIFFICULTY_LEVELS } from '../../data/gameConstants';
import { CharacterAvatar, GuideCharacter, MathTopic } from '../../types';
import { fireStarBurst } from '../../utils/confetti';
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
  const [centerpieceView, setCenterpieceView] = useState<'squad' | 'avatar'>('squad');
  const [showCartoonModal, setShowCartoonModal] = useState(false);
  const [modalMode, setModalMode] = useState<'cartoon' | 'original'>('cartoon');

  const cartoonImgPath = '/assets/maths_heroes_cartoon.jpg';
  const originalImgPath = '/assets/original_reference.jpg';

  const handleOpenCartoonModal = (mode: 'cartoon' | 'original' = 'cartoon') => {
    soundManager.playSparkle();
    fireStarBurst();
    setModalMode(mode);
    setShowCartoonModal(true);
  };

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

      {/* Main Interactive Stage Box: Cartoon Squad Centerpiece & Big Play */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-white/95 rounded-3xl p-5 sm:p-8 border-4 border-amber-200 shadow-2xl relative overflow-hidden backdrop-blur-xs mb-8">
        {/* Playful background decorative shapes */}
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-pink-100 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-amber-100 rounded-full blur-2xl pointer-events-none" />

        {/* Left: Cartoon Heroes Showcase or Player Avatar */}
        <div className="lg:col-span-5 flex flex-col items-center text-center">
          {/* Toggle View: Squad Cartoon vs Custom Avatar */}
          <div className="flex gap-1.5 p-1 bg-amber-100/80 rounded-2xl border border-amber-300 mb-3 shadow-xs">
            <button
              onClick={() => {
                soundManager.playClick();
                setCenterpieceView('squad');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                centerpieceView === 'squad'
                  ? 'bg-amber-400 text-amber-950 shadow-sm scale-102'
                  : 'text-amber-800 hover:text-amber-950'
              }`}
            >
              🌟 Maths Hero Squad
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setCenterpieceView('avatar');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                centerpieceView === 'avatar'
                  ? 'bg-amber-400 text-amber-950 shadow-sm scale-102'
                  : 'text-amber-800 hover:text-amber-950'
              }`}
            >
              🎨 My Avatar
            </button>
          </div>

          {centerpieceView === 'squad' ? (
            /* Cartoon Squad Card - Substantially Increased Size */
            <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center animate-pop-in">
              <div
                onClick={() => handleOpenCartoonModal('cartoon')}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border-4 border-amber-300 shadow-2xl transition-all duration-300 hover:scale-102 hover:shadow-amber-200/50 bg-amber-50 w-full"
              >
                {/* Large Cartoon of the 4 children */}
                <img
                  src={cartoonImgPath}
                  alt="Cartoon of the Maths Adventure Squad"
                  className="w-full h-[380px] sm:h-[460px] md:h-[500px] object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('maths_heroes_cartoon_1793189009498.jpg')) {
                      target.src = '/src/assets/images/maths_heroes_cartoon_1793189009498.jpg';
                    }
                  }}
                />

                {/* Sparkling overlay tag */}
                <div className="absolute top-3 left-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-white/50">
                  <span className="text-base">⭐</span>
                  <span>Maths Heroes Squad</span>
                </div>

                {/* Zoom prompt badge */}
                <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-white text-xs font-black px-3 py-1.5 rounded-full opacity-90 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 shadow-lg border border-white/30">
                  <span>🔍</span>
                  <span>Tap to Enlarge</span>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading mt-3">
                The Maths Adventure Squad
              </h3>
              <p className="text-xs sm:text-sm font-bold text-slate-600 max-w-sm">
                Four brave young heroes ready to explore, count, and conquer every maths realm!
              </p>
            </div>
          ) : (
            /* Custom Avatar View */
            <div className="w-full max-w-xs flex flex-col items-center animate-pop-in">
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-black text-indigo-900 mt-1 mb-2">
                <span>{currentDiff.badge}</span>
                <span>{currentDiff.name}</span>
              </div>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-4 gap-2 w-full max-w-sm mt-3">
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

      {/* Featured Cartoon Heroes Spotlight Banner - Extra Large & Prominent */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-2xl mb-8 relative overflow-hidden border-4 border-amber-300">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          {/* Substantially Enlarged Cartoon Showcase Image */}
          <div
            onClick={() => handleOpenCartoonModal('cartoon')}
            className="cursor-pointer shrink-0 w-52 h-68 sm:w-64 sm:h-84 md:w-80 md:h-[420px] rounded-3xl overflow-hidden border-4 border-white shadow-2xl hover:scale-103 transition-transform bg-black/20"
          >
            <img
              src={cartoonImgPath}
              alt="Maths Adventure Cartoon Heroes"
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('maths_heroes_cartoon_1793189009498.jpg')) {
                  target.src = '/src/assets/images/maths_heroes_cartoon_1793189009498.jpg';
                }
              }}
            />
          </div>

          <div className="text-center md:text-left space-y-3 flex-1">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black text-amber-200 shadow-xs border border-white/20">
              <span className="text-base">🌟</span>
              <span>SPECIAL HEROES SHOWCASE</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black font-heading leading-tight text-white drop-shadow">
              Meet the Maths Adventure Squad!
            </h3>
            <p className="text-sm sm:text-base font-semibold text-emerald-100 leading-relaxed max-w-2xl">
              Inspired by real school heroes, this brave squad explores Addition Island, scales Multiplication Mountain, unlocks Division Castle, and balances Ratio River. They prove that with curiosity, courage, and teamwork, every child can become a true Maths Hero!
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <button
                onClick={() => handleOpenCartoonModal('cartoon')}
                className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-sm shadow-lg active:scale-95 transition flex items-center gap-2"
              >
                <span className="text-base">🎨</span>
                <span>View Large Cartoon Poster</span>
              </button>
              <button
                onClick={() => handleOpenCartoonModal('original')}
                className="px-4 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-sm active:scale-95 transition flex items-center gap-2 border border-white/30"
              >
                <span className="text-base">📸</span>
                <span>See Original Photo</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Companion Bubble at bottom */}
      <div className="mt-2 flex justify-center sm:justify-start">
        <CharacterGuide
          guideId={guideCharacterId}
          speechText="Welcome back, Maths Hero! Ready to conquer new challenges today with the squad?"
        />
      </div>

      {/* Cartoon & Photo Showcase Modal - Extra Large Size */}
      {showCartoonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-sm animate-pop-in select-none">
          <div className="w-full max-w-2xl sm:max-w-3xl bg-white rounded-3xl p-5 sm:p-7 border-4 border-amber-300 shadow-2xl relative max-h-[96vh] flex flex-col items-center text-center overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => {
                soundManager.playClick();
                setShowCartoonModal(false);
              }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center transition shadow-xs text-base"
            >
              ✕
            </button>

            {/* Mode Toggle Switch */}
            <div className="flex gap-2 p-1.5 bg-amber-100 rounded-2xl border border-amber-300 mb-4">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setModalMode('cartoon');
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition ${
                  modalMode === 'cartoon'
                    ? 'bg-amber-400 text-amber-950 shadow-md scale-102'
                    : 'text-amber-900 hover:text-amber-950'
                }`}
              >
                🎨 Cartoon Heroes
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setModalMode('original');
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition ${
                  modalMode === 'original'
                    ? 'bg-amber-400 text-amber-950 shadow-md scale-102'
                    : 'text-amber-900 hover:text-amber-950'
                }`}
              >
                📸 Original School Photo
              </button>
            </div>

            {/* Image Frame - Large High-Resolution Display */}
            <div className="relative rounded-2xl overflow-hidden border-4 border-amber-300 shadow-2xl max-h-[68vh] sm:max-h-[72vh] flex items-center justify-center bg-slate-100 w-full">
              <img
                src={modalMode === 'cartoon' ? cartoonImgPath : originalImgPath}
                alt={modalMode === 'cartoon' ? 'Cartoon of the children' : 'Original photograph of the children'}
                className="max-h-[66vh] sm:max-h-[70vh] w-auto max-w-full object-contain rounded-xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (modalMode === 'cartoon' && !target.src.includes('maths_heroes_cartoon_1793189009498.jpg')) {
                    target.src = '/src/assets/images/maths_heroes_cartoon_1793189009498.jpg';
                  } else if (modalMode === 'original') {
                    target.src = '/public/assets/aistudio/IMG-20260914-WA0012_26350f23.jpg';
                  }
                }}
              />
            </div>

            <h4 className="text-xl sm:text-2xl font-black text-indigo-950 font-heading mt-4">
              {modalMode === 'cartoon'
                ? 'The Maths Adventure Heroes! 🚀⭐'
                : 'The Real Heroes in School Uniform! 🏫'}
            </h4>
            <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1 max-w-md">
              {modalMode === 'cartoon'
                ? 'United on an inspiring mission to make mathematics joyous, engaging, and rewarding for all learners.'
                : 'Posing proudly in their green uniform berets and backpacks before embarking on their maths journey!'}
            </p>

            <button
              onClick={() => {
                soundManager.playSparkle();
                setShowCartoonModal(false);
              }}
              className="mt-4 w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-base rounded-2xl shadow-md hover:brightness-110 active:scale-95 transition"
            >
              Continue Adventure! 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
