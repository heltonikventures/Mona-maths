import React from 'react';
import { GUIDE_CHARACTERS } from '../../data/gameConstants';
import { GuideCharacter } from '../../types';

interface CharacterGuideProps {
  guideId: GuideCharacter['id'];
  speechText?: string;
  mood?: 'happy' | 'thinking' | 'celebrating' | 'hint';
  className?: string;
  onAvatarClick?: () => void;
}

export const CharacterGuide: React.FC<CharacterGuideProps> = ({
  guideId,
  speechText,
  mood = 'happy',
  className = '',
  onAvatarClick,
}) => {
  const guide = GUIDE_CHARACTERS.find((g) => g.id === guideId) || GUIDE_CHARACTERS[0];

  return (
    <div className={`flex items-end gap-3 select-none ${className}`}>
      {/* Animated Cartoon Guide Character Avatar */}
      <button
        type="button"
        onClick={onAvatarClick}
        title={`Click to switch guide companion (${guide.name})`}
        className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1 shadow-lg border-3 transition-transform hover:scale-105 active:scale-95 ${
          guide.avatarBg
        } ${mood === 'celebrating' ? 'animate-bounce' : 'animate-float'}`}
      >
        <div className="w-full h-full flex flex-col items-center justify-center relative">
          {guide.id === 'milo' && (
            <div className="text-3xl sm:text-4xl filter drop-shadow">🧭</div>
          )}
          {guide.id === 'luna' && (
            <div className="text-3xl sm:text-4xl filter drop-shadow">⭐</div>
          )}
          {guide.id === 'bobo' && (
            <div className="text-3xl sm:text-4xl filter drop-shadow">🐵</div>
          )}
          {guide.id === 'pip' && (
            <div className="text-3xl sm:text-4xl filter drop-shadow">🤖</div>
          )}
          {guide.id === 'zara' && (
            <div className="text-3xl sm:text-4xl filter drop-shadow">🦊</div>
          )}

          <span className="text-[11px] sm:text-xs font-black tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-white/90 text-slate-800 shadow-xs mt-0.5">
            {guide.name}
          </span>
        </div>
      </button>

      {/* Speech Bubble */}
      {speechText && (
        <div className="relative bg-white border-2 border-amber-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-md max-w-sm sm:max-w-md animate-pop-in">
          {/* Speech bubble tail pointer */}
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-b-2 border-l-2 border-amber-200 transform -rotate-45" />

          <p className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
            {speechText}
          </p>
        </div>
      )}
    </div>
  );
};
