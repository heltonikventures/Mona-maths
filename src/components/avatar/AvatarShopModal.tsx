import React, { useState } from 'react';
import { GUIDE_CHARACTERS } from '../../data/gameConstants';
import { CharacterAvatar, GuideCharacter, ShopGearItem } from '../../types';
import { soundManager } from '../../utils/sound';
import { AvatarRenderer } from './AvatarRenderer';

interface AvatarShopModalProps {
  avatar: CharacterAvatar;
  onUpdateAvatar: (newAvatar: Partial<CharacterAvatar>) => void;
  coins: number;
  shopGear: ShopGearItem[];
  onBuyItem: (item: ShopGearItem) => boolean;
  guideCharacterId: GuideCharacter['id'];
  onSelectGuide: (id: GuideCharacter['id']) => void;
  onClose: () => void;
}

export const AvatarShopModal: React.FC<AvatarShopModalProps> = ({
  avatar,
  onUpdateAvatar,
  coins,
  shopGear,
  onBuyItem,
  guideCharacterId,
  onSelectGuide,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'gear' | 'style' | 'guide'>('gear');
  const [gearCategory, setGearCategory] = useState<'hat' | 'glasses' | 'accessory'>('hat');

  const filteredGear = shopGear.filter((item) => item.category === gearCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-pop-in select-none">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-2xl relative max-h-[92vh] flex flex-col">
        {/* Close button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center transition"
        >
          ✕
        </button>

        {/* Header & Coins */}
        <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎒</span>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                Hero Wardrobe & Gear Shop
              </h3>
              <p className="text-xs font-bold text-slate-500">
                Unlock cool hats, glasses, and rocket packs with your earned coins!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-amber-100 border-2 border-amber-300 px-3.5 py-1.5 rounded-full text-sm font-black text-amber-900 shadow-xs">
            <span className="text-base animate-coin-bounce">🪙</span>
            <span>{coins} Coins</span>
          </div>
        </div>

        {/* Live Avatar Preview Card */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border-2 border-amber-200 flex items-center justify-center gap-6 mb-4 shadow-inner">
          <AvatarRenderer avatar={avatar} size="lg" animated />
          <div className="text-left space-y-1">
            <span className="text-xs font-black uppercase text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-md">
              Current Outfit
            </span>
            <p className="text-sm font-extrabold text-slate-700">
              Hat: <span className="text-indigo-600 capitalize">{avatar.hat}</span>
            </p>
            <p className="text-sm font-extrabold text-slate-700">
              Glasses: <span className="text-indigo-600 capitalize">{avatar.glasses}</span>
            </p>
            <p className="text-sm font-extrabold text-slate-700">
              Gear: <span className="text-indigo-600 capitalize">{avatar.accessory}</span>
            </p>
          </div>
        </div>

        {/* Nav Tabs */}
        <div className="flex gap-2 border-b-2 border-slate-100 pb-3 mb-4">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('gear');
            }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-black transition ${
              activeTab === 'gear'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ⭐ Special Gear Shop
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('style');
            }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-black transition ${
              activeTab === 'style'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🎨 Colors & Hair
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('guide');
            }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-black transition ${
              activeTab === 'guide'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🐵 Guide Companion
          </button>
        </div>

        {/* TAB 1: GEAR SHOP */}
        {activeTab === 'gear' && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {/* Gear Category Sub-tabs */}
            <div className="flex gap-2 mb-2">
              {(['hat', 'glasses', 'accessory'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    soundManager.playClick();
                    setGearCategory(cat);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black capitalize border ${
                    gearCategory === cat
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  {cat === 'accessory' ? 'Backpack / Wand' : cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredGear.map((item) => {
                const isEquipped = avatar[item.category] === item.value;

                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border-2 flex flex-col justify-between transition-all ${
                      isEquipped
                        ? 'border-emerald-500 bg-emerald-50 shadow-xs'
                        : item.unlocked
                        ? 'border-slate-300 bg-white'
                        : 'border-amber-200 bg-amber-50/50'
                    }`}
                  >
                    <div className="text-center mb-2">
                      <span className="text-3xl block">{item.icon}</span>
                      <h4 className="text-xs sm:text-sm font-black text-slate-800 mt-1">
                        {item.name}
                      </h4>
                    </div>

                    {isEquipped ? (
                      <span className="w-full py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-black text-center block">
                        Equipped ✓
                      </span>
                    ) : item.unlocked ? (
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onUpdateAvatar({ [item.category]: item.value });
                        }}
                        className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-black transition active:scale-95"
                      >
                        Equip
                      </button>
                    ) : (
                      <button
                        onClick={() => onBuyItem(item)}
                        className="w-full py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 text-xs font-black flex items-center justify-center gap-1 shadow-xs transition active:scale-95"
                      >
                        <span>🪙</span>
                        <span>{item.price}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: STYLES & COLORS */}
        {activeTab === 'style' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {/* Base Type */}
            <div>
              <span className="text-xs font-black text-slate-700 uppercase block mb-1.5">
                Avatar Base
              </span>
              <div className="grid grid-cols-4 gap-2">
                {(['boy', 'girl', 'robot', 'animal'] as const).map((gender) => (
                  <button
                    key={gender}
                    onClick={() => {
                      soundManager.playClick();
                      onUpdateAvatar({ gender });
                    }}
                    className={`py-2 rounded-xl text-xs font-black capitalize border-2 ${
                      avatar.gender === gender
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Style */}
            {avatar.gender !== 'robot' && avatar.gender !== 'animal' && (
              <div>
                <span className="text-xs font-black text-slate-700 uppercase block mb-1.5">
                  Hairstyle
                </span>
                <div className="grid grid-cols-5 gap-2">
                  {(['spiky', 'curly', 'ponytail', 'bob', 'straight'] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => {
                        soundManager.playClick();
                        onUpdateAvatar({ hairStyle: style });
                      }}
                      className={`py-2 rounded-xl text-xs font-black capitalize border ${
                        avatar.hairStyle === style
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Shirt Colors */}
            <div>
              <span className="text-xs font-black text-slate-700 uppercase block mb-1.5">
                Shirt Color
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  '#3B82F6',
                  '#10B981',
                  '#EF4444',
                  '#F59E0B',
                  '#8B5CF6',
                  '#EC4899',
                  '#06B6D4',
                  '#1E293B',
                ].map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      soundManager.playClick();
                      onUpdateAvatar({ clothingColor: color });
                    }}
                    className={`w-9 h-9 rounded-full border-3 transition-transform ${
                      avatar.clothingColor === color ? 'border-amber-400 scale-110 shadow-md' : 'border-white'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GUIDE COMPANION */}
        {activeTab === 'guide' && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            <p className="text-xs font-bold text-slate-600 mb-2">
              Choose who travels by your side and provides clues during mathematics adventures!
            </p>

            <div className="space-y-2">
              {GUIDE_CHARACTERS.map((guide) => {
                const isSelected = guideCharacterId === guide.id;
                return (
                  <button
                    key={guide.id}
                    onClick={() => {
                      onSelectGuide(guide.id);
                    }}
                    className={`w-full p-3.5 rounded-2xl border-2 flex items-center gap-3 text-left transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-4xl">
                      {guide.id === 'milo' && '🧭'}
                      {guide.id === 'luna' && '⭐'}
                      {guide.id === 'bobo' && '🐵'}
                      {guide.id === 'pip' && '🤖'}
                      {guide.id === 'zara' && '🦊'}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-slate-900">{guide.name}</h4>
                        <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                          {guide.title}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        “{guide.catchphrase}”
                      </p>
                    </div>
                    {isSelected && <span className="text-indigo-600 font-black text-sm">Active ✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Done Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="mt-4 w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-black text-base rounded-2xl shadow-md transition active:scale-95"
        >
          Save & Return to Adventure! 🚀
        </button>
      </div>
    </div>
  );
};
