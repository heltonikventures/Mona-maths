import React from 'react';
import { CharacterAvatar } from '../../types';

interface AvatarRendererProps {
  avatar: CharacterAvatar;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({
  avatar,
  size = 'md',
  animated = false,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-28 h-28',
    xl: 'w-44 h-44',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full select-none ${sizeMap[size]} ${
        animated ? 'animate-float' : ''
      } ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-md overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="avatar-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Accessory: Back Layer (Cape, Jetpack, Backpack) */}
        {avatar.accessory === 'cape' && (
          <path
            d="M 50 120 L 30 190 Q 100 205 170 190 L 150 120 Z"
            fill="#EF4444"
            stroke="#B91C1C"
            strokeWidth="3"
          />
        )}
        {avatar.accessory === 'jetpack' && (
          <g>
            <rect x="36" y="115" width="22" height="50" rx="10" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
            <rect x="142" y="115" width="22" height="50" rx="10" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
            {/* Jet flame */}
            <polygon points="40,165 47,190 54,165" fill="#F97316" />
            <polygon points="146,165 153,190 160,165" fill="#F97316" />
          </g>
        )}
        {avatar.accessory === 'backpack' && (
          <rect x="42" y="116" width="116" height="55" rx="18" fill="#F59E0B" stroke="#B45309" strokeWidth="3" />
        )}

        {/* Body / Shirt */}
        <path
          d="M 60 140 C 60 120, 140 120, 140 140 L 155 195 C 155 198, 45 198, 45 195 Z"
          fill={avatar.clothingColor || '#3B82F6'}
          stroke="#1E293B"
          strokeWidth="3"
        />
        {/* Shirt collar / star patch */}
        <polygon points="100,142 104,152 115,152 106,158 109,168 100,162 91,168 94,158 85,152 96,152" fill="#FDE047" />

        {/* Neck */}
        <rect x="88" y="110" width="24" height="20" rx="6" fill={avatar.skinColor || '#FDE68A'} />

        {/* Head Base */}
        {avatar.gender === 'robot' ? (
          <g>
            {/* Robot Head */}
            <rect x="55" y="45" width="90" height="75" rx="20" fill="#CBD5E1" stroke="#334155" strokeWidth="4" />
            {/* Antenna */}
            <line x1="100" y1="45" x2="100" y2="25" stroke="#334155" strokeWidth="4" />
            <circle cx="100" cy="20" r="8" fill="#38BDF8" className="animate-pulse" />
            {/* Screen visor */}
            <rect x="68" y="60" width="64" height="36" rx="10" fill="#0F172A" />
            {/* Robot glowing eyes */}
            <circle cx="85" cy="78" r="6" fill="#38BDF8" />
            <circle cx="115" cy="78" r="6" fill="#38BDF8" />
            {/* Robot mouth */}
            <line x1="84" y1="102" x2="116" y2="102" stroke="#475569" strokeWidth="3" strokeDasharray="4 2" />
          </g>
        ) : avatar.gender === 'animal' ? (
          <g>
            {/* Animal (Monkey / Bear) ears */}
            <circle cx="50" cy="70" r="20" fill="#B45309" />
            <circle cx="50" cy="70" r="12" fill="#FDE68A" />
            <circle cx="150" cy="70" r="20" fill="#B45309" />
            <circle cx="150" cy="70" r="12" fill="#FDE68A" />
            {/* Head */}
            <circle cx="100" cy="85" r="48" fill="#D97706" stroke="#78350F" strokeWidth="3" />
            {/* Animal Muzzle */}
            <ellipse cx="100" cy="98" rx="28" ry="20" fill="#FDE68A" />
            <ellipse cx="100" cy="92" rx="7" ry="5" fill="#451A03" />
            {/* Eyes */}
            <circle cx="82" cy="76" r="8" fill="#1E293B" />
            <circle cx="80" cy="73" r="2.5" fill="#FFFFFF" />
            <circle cx="118" cy="76" r="8" fill="#1E293B" />
            <circle cx="116" cy="73" r="2.5" fill="#FFFFFF" />
            {/* Cheerful mouth */}
            <path d="M 90 102 Q 100 114 110 102" stroke="#451A03" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        ) : (
          /* Human Child Head */
          <g>
            {/* Ears */}
            <circle cx="54" cy="86" r="12" fill={avatar.skinColor || '#FDE68A'} />
            <circle cx="146" cy="86" r="12" fill={avatar.skinColor || '#FDE68A'} />
            {/* Face shape */}
            <circle cx="100" cy="85" r="46" fill={avatar.skinColor || '#FDE68A'} stroke="#F59E0B" strokeWidth="1" />
            {/* Cute Rosy Cheeks */}
            <ellipse cx="72" cy="96" rx="8" ry="5" fill="#FB7185" opacity="0.6" />
            <ellipse cx="128" cy="96" rx="8" ry="5" fill="#FB7185" opacity="0.6" />
            {/* Big Friendly Eyes */}
            <ellipse cx="80" cy="82" rx="9" ry="12" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
            <ellipse cx="120" cy="82" rx="9" ry="12" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
            <circle cx="82" cy="82" r="6" fill="#1E293B" />
            <circle cx="122" cy="82" r="6" fill="#1E293B" />
            {/* Eye sparkle highlights */}
            <circle cx="84" cy="79" r="2.2" fill="#FFFFFF" />
            <circle cx="124" cy="79" r="2.2" fill="#FFFFFF" />
            {/* Eyebrows */}
            <path d="M 72 68 Q 80 64 88 68" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 112 68 Q 120 64 128 68" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Cheerful Smile */}
            <path d="M 88 98 Q 100 114 112 98" stroke="#B45309" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            {/* Small nose */}
            <circle cx="100" cy="90" r="2.5" fill="#F59E0B" />
          </g>
        )}

        {/* Hair Layer (if human) */}
        {avatar.gender !== 'robot' && avatar.gender !== 'animal' && (
          <g fill={avatar.hairColor || '#78350F'}>
            {avatar.hairStyle === 'curly' ? (
              <g>
                <circle cx="70" cy="48" r="18" />
                <circle cx="95" cy="42" r="20" />
                <circle cx="125" cy="46" r="18" />
                <circle cx="56" cy="65" r="16" />
                <circle cx="144" cy="65" r="16" />
              </g>
            ) : avatar.hairStyle === 'ponytail' ? (
              <g>
                <path d="M 60 70 C 60 38, 140 38, 140 70 C 130 50, 70 50, 60 70 Z" />
                {/* Ponytail on right */}
                <ellipse cx="148" cy="50" rx="16" ry="24" transform="rotate(25 148 50)" />
                <circle cx="138" cy="52" r="6" fill="#EC4899" />
              </g>
            ) : avatar.hairStyle === 'spiky' ? (
              <g>
                <polygon points="65,58 75,30 85,55" />
                <polygon points="80,55 95,24 108,52" />
                <polygon points="105,52 120,28 132,58" />
                <path d="M 58 70 C 58 45, 142 45, 142 70 Z" />
              </g>
            ) : avatar.hairStyle === 'bob' ? (
              <path d="M 52 88 C 50 40, 150 40, 148 88 C 144 65, 130 52, 100 52 C 70 52, 56 65, 52 88 Z" />
            ) : (
              /* Default Swoop */
              <path d="M 55 68 C 65 38, 135 38, 145 68 C 120 48, 80 50, 55 68 Z" />
            )}
          </g>
        )}

        {/* Glasses */}
        {avatar.glasses === 'round' && (
          <g stroke="#1E293B" strokeWidth="3" fill="none">
            <circle cx="80" cy="82" r="16" stroke="#475569" fill="#93C5FD" fillOpacity="0.25" />
            <circle cx="120" cy="82" r="16" stroke="#475569" fill="#93C5FD" fillOpacity="0.25" />
            <line x1="96" y1="82" x2="104" y2="82" stroke="#475569" />
          </g>
        )}
        {avatar.glasses === 'star' && (
          <g fill="#FDE047" stroke="#CA8A04" strokeWidth="2">
            <polygon points="80,68 84,78 95,78 86,85 89,96 80,90 71,96 74,85 65,78 76,78" />
            <polygon points="120,68 124,78 135,78 126,85 129,96 120,90 111,96 114,85 105,78 116,78" />
            <line x1="95" y1="82" x2="105" y2="82" stroke="#CA8A04" strokeWidth="3" />
          </g>
        )}
        {avatar.glasses === 'goggles' && (
          <g>
            <rect x="62" y="72" width="76" height="22" rx="10" fill="#0284C7" stroke="#0369A1" strokeWidth="3" />
            <circle cx="78" cy="83" r="8" fill="#BAE6FD" />
            <circle cx="122" cy="83" r="8" fill="#BAE6FD" />
          </g>
        )}

        {/* Hat Layer */}
        {avatar.hat === 'crown' && (
          <g filter="url(#avatar-shadow)">
            <polygon points="65,48 75,20 100,38 125,20 135,48" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
            <rect x="64" y="46" width="72" height="10" rx="3" fill="#EAB308" />
            <circle cx="75" cy="22" r="3" fill="#EF4444" />
            <circle cx="100" cy="38" r="3" fill="#3B82F6" />
            <circle cx="125" cy="22" r="3" fill="#10B981" />
          </g>
        )}
        {avatar.hat === 'cap' && (
          <g>
            <path d="M 60 55 C 60 28, 140 28, 140 55 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
            <path d="M 80 55 C 110 50, 160 52, 165 62 L 135 62 Z" fill="#DC2626" />
          </g>
        )}
        {avatar.hat === 'explorer' && (
          <g>
            <path d="M 70 54 Q 100 24 130 54 Z" fill="#10B981" stroke="#047857" strokeWidth="2" />
            <ellipse cx="100" cy="54" rx="44" ry="10" fill="#059669" />
            <rect x="90" y="46" width="20" height="6" fill="#F59E0B" rx="2" />
          </g>
        )}
        {avatar.hat === 'wizard' && (
          <g>
            <polygon points="62,56 100,4 138,56" fill="#7C3AED" stroke="#5B21B6" strokeWidth="2" />
            <ellipse cx="100" cy="56" rx="42" ry="10" fill="#6D28D9" />
            <polygon points="100,28 102,34 108,34 103,38 105,44 100,40 95,44 97,38 92,34 98,34" fill="#FDE047" />
          </g>
        )}
        {avatar.hat === 'astronaut' && (
          <g>
            <circle cx="100" cy="85" r="54" fill="none" stroke="#E2E8F0" strokeWidth="8" />
            <rect x="70" y="58" width="60" height="38" rx="14" fill="#38BDF8" fillOpacity="0.4" stroke="#0284C7" strokeWidth="2" />
          </g>
        )}

        {/* Hand with Magic Wand (Front Accessory) */}
        {avatar.accessory === 'magic-wand' && (
          <g>
            <line x1="140" y1="130" x2="175" y2="90" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
            <polygon points="175,85 178,92 185,92 180,96 182,103 175,99 168,103 170,96 165,92 172,92" fill="#FACC15" />
          </g>
        )}
      </svg>
    </div>
  );
};
