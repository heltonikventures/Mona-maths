import React, { useState } from 'react';
import { GUIDE_CHARACTERS } from '../../data/gameConstants';
import { CharacterAvatar, DifficultyLevel, GuideCharacter } from '../../types';
import { soundManager } from '../../utils/sound';
import { AvatarRenderer } from '../avatar/AvatarRenderer';

interface OnboardingModalProps {
  onComplete: (
    name: string,
    age: string,
    level: DifficultyLevel,
    avatar: Partial<CharacterAvatar>,
    guide: GuideCharacter['id']
  ) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Welcome & Guide, 2: Avatar & Name, 3: Age & Diagnostic, 4: Result

  const [name, setName] = useState('Alex');
  const [selectedGuide, setSelectedGuide] = useState<GuideCharacter['id']>('milo');
  const [selectedAge, setSelectedAge] = useState('8-9');

  const [avatar, setAvatar] = useState<CharacterAvatar>({
    gender: 'boy',
    skinColor: '#FDE68A',
    hairStyle: 'spiky',
    hairColor: '#78350F',
    clothingColor: '#3B82F6',
    hat: 'cap',
    glasses: 'none',
    accessory: 'backpack',
  });

  // Diagnostic questions
  const [diagScore, setDiagScore] = useState(0);
  const [diagIndex, setDiagIndex] = useState(0);

  const diagQuestions = [
    { q: '5 + 4 = ?', options: [8, 9, 10, 11], ans: 9 },
    { q: '12 − 5 = ?', options: [6, 7, 8, 9], ans: 7 },
    { q: '3 × 4 = ?', options: [10, 12, 14, 16], ans: 12 },
  ];

  const handleDiagAnswer = (selected: number) => {
    soundManager.playClick();
    if (selected === diagQuestions[diagIndex].ans) {
      soundManager.playCorrect();
      setDiagScore((s) => s + 1);
    } else {
      soundManager.playGentleBoop();
    }

    if (diagIndex < diagQuestions.length - 1) {
      setDiagIndex((i) => i + 1);
    } else {
      // Diagnostic complete, move to step 4
      setStep(4);
    }
  };

  const calculateRecommendedLevel = (): DifficultyLevel => {
    if (diagScore === 3) return 3; // Learner
    if (diagScore === 2) return 2; // Explorer
    return 1; // Beginner
  };

  const finishOnboarding = () => {
    const recommended = calculateRecommendedLevel();
    onComplete(name.trim() || 'Hero', selectedAge, recommended, avatar, selectedGuide);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs select-none">
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-2xl relative overflow-hidden animate-pop-in">
        {/* Step indicator pills */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-8 bg-amber-500'
                  : s < step
                  ? 'w-5 bg-emerald-400'
                  : 'w-2.5 bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: WELCOME & CHOOSE GUIDE */}
        {step === 1 && (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 to-pink-500 text-4xl shadow-lg animate-bounce">
              ⭐
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-indigo-950 font-heading">
              Welcome to Maths Adventure!
            </h2>
            <div className="flex justify-center items-center gap-3 my-2">
              <div className="w-16 h-20 rounded-xl overflow-hidden border-2 border-amber-300 shadow-md">
                <img
                  src="/assets/maths_heroes_cartoon.jpg"
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
              <div className="text-left">
                <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mb-0.5">
                  🌟 The Maths Squad
                </span>
                <p className="text-xs font-bold text-slate-600 max-w-[240px]">
                  Join our brave school heroes on a fun mathematical quest!
                </p>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs sm:text-sm font-black text-amber-900 mb-3 uppercase tracking-wide">
                Choose your friendly Cartoon Guide:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-md mx-auto">
                {GUIDE_CHARACTERS.map((guide) => (
                  <button
                    key={guide.id}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedGuide(guide.id);
                    }}
                    className={`p-3 rounded-2xl border-3 flex flex-col items-center gap-1 transition-all ${
                      selectedGuide === guide.id
                        ? 'border-indigo-600 bg-indigo-50 scale-105 shadow-md'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-3xl">
                      {guide.id === 'milo' && '🧭'}
                      {guide.id === 'luna' && '⭐'}
                      {guide.id === 'bobo' && '🐵'}
                      {guide.id === 'pip' && '🤖'}
                      {guide.id === 'zara' && '🦊'}
                    </span>
                    <span className="text-xs font-black text-slate-800">{guide.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setStep(2);
              }}
              className="w-full mt-4 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-black rounded-2xl shadow-md text-base active:scale-95 transition"
            >
              Next: Customize Your Avatar 🎨
            </button>
          </div>
        )}

        {/* STEP 2: AVATAR CUSTOMIZATION & NAME */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-black text-indigo-950 font-heading">
                Create Your Hero Avatar!
              </h3>
              <p className="text-xs sm:text-sm font-bold text-slate-500">
                Pick your look, style, and secret adventurer name!
              </p>
            </div>

            {/* Avatar Preview */}
            <div className="flex justify-center py-2">
              <AvatarRenderer avatar={avatar} size="lg" animated />
            </div>

            {/* Hero Name Input */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                Your Hero Name:
              </label>
              <input
                type="text"
                value={name}
                maxLength={14}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter hero name..."
                className="w-full px-4 py-3 bg-amber-50 border-2 border-amber-300 rounded-2xl font-black text-slate-800 text-lg focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Avatar Base Selector */}
            <div className="grid grid-cols-4 gap-2">
              {(['boy', 'girl', 'robot', 'animal'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setAvatar((a) => ({ ...a, gender: type }));
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-black capitalize border-2 transition ${
                    avatar.gender === type
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Quick Color & Hat selector */}
            <div className="flex gap-2">
              <div className="flex-1">
                <span className="text-[11px] font-black text-slate-600 uppercase block mb-1">Shirt</span>
                <div className="flex gap-1.5">
                  {['#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setAvatar((a) => ({ ...a, clothingColor: color }))}
                      className="w-7 h-7 rounded-full border-2 border-white shadow-xs"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-black text-slate-600 uppercase block mb-1">Starter Hat</span>
                <div className="flex gap-1">
                  {(['cap', 'none', 'explorer'] as const).map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setAvatar((a) => ({ ...a, hat: h }))}
                      className={`text-xs font-black px-2 py-1 rounded-lg border ${
                        avatar.hat === h ? 'bg-amber-100 border-amber-400' : 'bg-slate-50'
                      }`}
                    >
                      {h === 'none' ? 'None' : h}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-4 bg-slate-100 text-slate-700 font-black rounded-2xl"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setStep(3);
                }}
                className="flex-1 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-black rounded-2xl shadow-md text-base"
              >
                Next: Quick Math Mini-Game 🎯
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: AGE SELECTOR & 3-QUESTION DIAGNOSTIC */}
        {step === 3 && (
          <div className="space-y-4 text-center">
            <h3 className="text-xl sm:text-2xl font-black text-indigo-950 font-heading">
              Quick Diagnostic Mini-Game
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-600">
              Answer 3 playful questions so we can pick the best starting level for you!
            </p>

            {/* Age Group Selector */}
            <div className="flex justify-center gap-2 my-2">
              {['6-7 Years', '8-9 Years', '10-12 Years'].map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => setSelectedAge(age)}
                  className={`px-3 py-1.5 rounded-full text-xs font-black border-2 transition ${
                    selectedAge === age
                      ? 'border-amber-500 bg-amber-100 text-amber-900'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>

            {/* Diagnostic Question Card */}
            <div className="bg-amber-50 rounded-2xl p-5 border-2 border-amber-300">
              <span className="text-xs font-black text-amber-800 uppercase tracking-wider block mb-1">
                Question {diagIndex + 1} of 3
              </span>
              <div className="text-3xl sm:text-4xl font-black text-indigo-950 my-3">
                {diagQuestions[diagIndex].q}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                {diagQuestions[diagIndex].options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleDiagAnswer(opt)}
                    className="py-3 px-2 rounded-xl bg-white hover:bg-amber-100 border-2 border-amber-200 text-xl font-black text-slate-800 shadow-xs active:scale-95 transition"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: RECOMMENDATION & FIRST REWARD */}
        {step === 4 && (
          <div className="text-center space-y-4">
            <div className="text-5xl animate-bounce">🎉</div>
            <h3 className="text-2xl sm:text-3xl font-black text-indigo-950 font-heading">
              You're Ready, {name}!
            </h3>
            <p className="text-sm font-bold text-slate-600">
              Based on your answers, your recommended starting level is:
            </p>

            <div className="inline-block p-4 bg-gradient-to-r from-amber-400 to-amber-500 rounded-3xl shadow-lg border-3 border-amber-200 text-amber-950">
              <span className="text-3xl block mb-1">
                {calculateRecommendedLevel() === 1 ? '🌱' : calculateRecommendedLevel() === 2 ? '🧭' : '📚'}
              </span>
              <span className="text-xl font-black">
                Level {calculateRecommendedLevel()} —{' '}
                {calculateRecommendedLevel() === 1
                  ? 'Beginner'
                  : calculateRecommendedLevel() === 2
                  ? 'Explorer'
                  : 'Learner'}
              </span>
            </div>

            {/* Starter Gift Box */}
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 text-emerald-950 font-black text-sm">
              <div className="text-2xl mb-1">🎁 Welcome Gift Unlocked:</div>
              <div className="flex justify-center gap-4 text-base font-extrabold mt-1">
                <span>🪙 +50 Coins</span>
                <span>⭐ +5 Stars</span>
                <span>🎖️ Explorer Badge</span>
              </div>
            </div>

            <button
              type="button"
              onClick={finishOnboarding}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-lg rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition"
            >
              Enter the Adventure World! 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
