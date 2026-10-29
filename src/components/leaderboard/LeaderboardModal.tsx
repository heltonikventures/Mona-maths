import React, { useEffect, useState } from 'react';
import { fetchTopLeaderboard } from '../../firebase';
import { soundManager } from '../../utils/sound';

interface LeaderboardModalProps {
  onClose: () => void;
  playerName: string;
  playerStars: number;
  playerStreak: number;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  onClose,
  playerName,
  playerStars,
  playerStreak,
}) => {
  const [category, setCategory] = useState<'stars' | 'improved' | 'streak' | 'champion'>('stars');
  const [cloudLeaders, setCloudLeaders] = useState<Array<{ name: string; score: string; badge: string; isMe?: boolean }>>([]);
  const [isCloudLoaded, setIsCloudLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetchTopLeaderboard().then((entries) => {
      if (!isMounted) return;
      if (entries && entries.length > 0) {
        const mapped = entries.map((e, idx) => ({
          name: e.playerName === playerName ? `${playerName} (You)` : `${e.playerName} ${e.avatarIcon || '🌟'}`,
          score: `${e.stars} Stars`,
          badge: idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '🎖️',
          isMe: e.playerName === playerName,
        }));
        // If current player isn't in top entries, inject them
        if (!mapped.some(m => m.isMe)) {
          mapped.push({
            name: `${playerName} (You)`,
            score: `${playerStars} Stars`,
            badge: '⭐',
            isMe: true,
          });
        }
        setCloudLeaders(mapped);
        setIsCloudLoaded(true);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [playerName, playerStars]);

  const friendlyLeaders = {
    stars: isCloudLoaded && cloudLeaders.length > 0 ? cloudLeaders : [
      { name: 'Maya ⭐', score: `${playerStars > 50 ? playerStars + 12 : 58} Stars`, badge: '🥇' },
      { name: `${playerName} (You)`, score: `${playerStars} Stars`, badge: '🥈', isMe: true },
      { name: 'Tobi ⚡', score: '44 Stars', badge: '🥉' },
      { name: 'Emma 🦄', score: '38 Stars', badge: '🎖️' },
      { name: 'Leo 🦁', score: '32 Stars', badge: '🎖️' },
    ],
    improved: [
      { name: 'Leo 🦁', score: '+45% Boost', badge: '🚀' },
      { name: `${playerName} (You)`, score: '+35% Boost', badge: '⭐', isMe: true },
      { name: 'Emma 🦄', score: '+28% Boost', badge: '✨' },
      { name: 'Maya ⭐', score: '+22% Boost', badge: '🌟' },
    ],
    streak: [
      { name: 'Tobi ⚡', score: '9 Days Fire', badge: '🔥' },
      { name: `${playerName} (You)`, score: `${playerStreak} Days Fire`, badge: '🔥', isMe: true },
      { name: 'Maya ⭐', score: '5 Days Fire', badge: '🔥' },
      { name: 'Alex 🚀', score: '4 Days Fire', badge: '🔥' },
    ],
    champion: [
      { name: `${playerName} (You)`, score: 'Maths Hero Title', badge: '👑', isMe: true },
      { name: 'Maya ⭐', score: 'Island Master', badge: '🏆' },
      { name: 'Tobi ⚡', score: 'Mountain Climber', badge: '🏆' },
    ],
  };

  const currentList = friendlyLeaders[category];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-pop-in select-none">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-2xl relative max-h-[90vh] overflow-y-auto">
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

        <div className="text-center mb-5">
          <div className="text-4xl mb-1 animate-bounce">🏆</div>
          <h3 className="text-2xl font-black text-slate-900 font-heading">
            Friendly Adventurer Honors
          </h3>
          <p className="text-xs font-bold text-slate-500">
            Celebrating our collective effort and daily math milestones!
          </p>
        </div>

        {/* Category Pills */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => {
              soundManager.playClick();
              setCategory('stars');
            }}
            className={`py-2 px-1 rounded-xl text-xs font-black transition ${
              category === 'stars'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ⭐ Weekly Stars
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setCategory('improved');
            }}
            className={`py-2 px-1 rounded-xl text-xs font-black transition ${
              category === 'improved'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🚀 Most Improved
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setCategory('streak');
            }}
            className={`py-2 px-1 rounded-xl text-xs font-black transition ${
              category === 'streak'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🔥 Best Streak
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setCategory('champion');
            }}
            className={`py-2 px-1 rounded-xl text-xs font-black transition ${
              category === 'champion'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            👑 Maths Champions
          </button>
        </div>

        {/* List of Friendly Honors */}
        <div className="space-y-2">
          {currentList.map((leader) => (
            <div
              key={leader.name}
              className={`p-3 rounded-2xl border-2 flex items-center justify-between transition ${
                leader.isMe
                  ? 'bg-indigo-50 border-indigo-400 shadow-sm'
                  : 'bg-amber-50/50 border-amber-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{leader.badge}</span>
                <span className="text-sm font-black text-slate-800">
                  {leader.name}
                </span>
              </div>
              <span className="text-xs font-extrabold text-indigo-900 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-xs">
                {leader.score}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="mt-6 w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-black text-xs rounded-2xl shadow-md transition"
        >
          Back to Playing! 🎮
        </button>
      </div>
    </div>
  );
};
