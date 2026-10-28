import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_BADGES,
  INITIAL_SHOP_GEAR,
  REALMS
} from '../data/gameConstants';
import {
  BadgeItem,
  CharacterAvatar,
  ClassroomData,
  DailyQuest,
  DifficultyLevel,
  GuideCharacter,
  MathTopic,
  ShopGearItem,
  UserSettings,
  UserStats
} from '../types';
import { fireCelebrationConfetti, fireStarBurst } from '../utils/confetti';
import { soundManager } from '../utils/sound';
import { syncManager, SyncPayload } from '../utils/syncManager';

interface GameContextType {
  playerName: string;
  setPlayerName: (name: string) => void;
  avatar: CharacterAvatar;
  updateAvatar: (newAvatar: Partial<CharacterAvatar>) => void;
  guideCharacter: GuideCharacter['id'];
  setGuideCharacter: (id: GuideCharacter['id']) => void;
  ageGroup: string;
  setAgeGroup: (age: string) => void;
  isOnboarded: boolean;
  completeOnboarding: (name: string, age: string, initialLevel: DifficultyLevel, initialAvatar?: Partial<CharacterAvatar>) => void;

  level: DifficultyLevel;
  setLevel: (lvl: DifficultyLevel) => void;
  stars: number;
  coins: number;
  gems: number;
  streak: number;
  addCoins: (amount: number) => void;
  addStars: (amount: number) => void;
  addGems: (amount: number) => void;

  // Level Progression: topic -> array of star ratings (0 = locked/unplayed, 1-3 = completed)
  realmProgress: Record<MathTopic, number[]>;
  unlockLevel: (topic: MathTopic, levelIdx: number, starsEarned: number) => void;

  stats: UserStats;
  recordAnswer: (topic: MathTopic, isCorrect: boolean, timeSeconds?: number) => void;

  badges: BadgeItem[];
  shopGear: ShopGearItem[];
  buyShopItem: (item: ShopGearItem) => boolean;

  dailyQuests: DailyQuest[];
  claimDailyQuest: (questId: string) => void;

  classroom: ClassroomData;
  updateClassroom: (data: ClassroomData) => void;

  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;

  recentRewardModal: { show: boolean; title: string; rewardText: string; icon: string } | null;
  dismissRewardModal: () => void;
  resetAllData: () => void;
}

const defaultAvatar: CharacterAvatar = {
  gender: 'boy',
  skinColor: '#FDE68A',
  hairStyle: 'spiky',
  hairColor: '#78350F',
  clothingColor: '#3B82F6',
  hat: 'cap',
  glasses: 'none',
  accessory: 'backpack',
};

const defaultStats: UserStats = {
  additionScore: 0,
  subtractionScore: 0,
  multiplicationScore: 0,
  divisionScore: 0,
  ratioScore: 0,
  percentageScore: 0,
  additionAnswered: 0,
  subtractionAnswered: 0,
  multiplicationAnswered: 0,
  divisionAnswered: 0,
  ratioAnswered: 0,
  percentageAnswered: 0,
  totalCorrect: 0,
  totalAnswered: 0,
  streak: 3,
  bestStreak: 5,
  timeSpentSeconds: 120,
};

const defaultClassroom: ClassroomData = {
  className: 'Grade 3 Math Adventurers',
  code: 'MATH-HERO-2026',
  teacherName: 'Ms. Robinson',
  assignedTopic: 'all',
  assignedDifficulty: 2,
  students: [
    { id: '1', name: 'Alex', avatarChar: '🚀', level: 3, stars: 45, coins: 280, accuracy: 88, lastActive: 'Today' },
    { id: '2', name: 'Maya', avatarChar: '⭐', level: 4, stars: 62, coins: 410, accuracy: 94, lastActive: 'Today' },
    { id: '3', name: 'Leo', avatarChar: '🦁', level: 2, stars: 30, coins: 190, accuracy: 78, lastActive: 'Yesterday' },
    { id: '4', name: 'Emma', avatarChar: '🦄', level: 3, stars: 50, coins: 310, accuracy: 85, lastActive: 'Today' },
    { id: '5', name: 'Tobi', avatarChar: '⚡', level: 5, stars: 85, coins: 590, accuracy: 96, lastActive: 'Today' },
  ],
};

const defaultSettings: UserSettings = {
  soundEnabled: true,
  soundVolume: 0.6,
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  leaderboardEnabled: true,
};

const initialQuests: DailyQuest[] = [
  { id: 'dq-1', title: 'Collect 5 Fruit in Addition Island', topic: 'addition', targetCount: 5, currentCount: 2, rewardCoins: 30, rewardStars: 3, completed: false },
  { id: 'dq-2', title: 'Feed 3 Forest Monsters in Subtraction', topic: 'subtraction', targetCount: 3, currentCount: 1, rewardCoins: 25, rewardStars: 2, completed: false },
  { id: 'dq-3', title: 'Climb 4 Rocks on Multiplication Mountain', topic: 'multiplication', targetCount: 4, currentCount: 0, rewardCoins: 35, rewardStars: 3, completed: false },
  { id: 'dq-4', title: 'Share 3 Feasts in Division Castle', topic: 'division', targetCount: 3, currentCount: 0, rewardCoins: 30, rewardStars: 3, completed: false },
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage if available
  const [playerName, setPlayerNameState] = useState<string>(() => {
    return localStorage.getItem('maths_player_name') || 'Adventurer';
  });

  const [avatar, setAvatarState] = useState<CharacterAvatar>(() => {
    const saved = localStorage.getItem('maths_avatar');
    return saved ? JSON.parse(saved) : defaultAvatar;
  });

  const [guideCharacter, setGuideCharacterState] = useState<GuideCharacter['id']>(() => {
    return (localStorage.getItem('maths_guide') as GuideCharacter['id']) || 'milo';
  });

  const [ageGroup, setAgeGroupState] = useState<string>(() => {
    return localStorage.getItem('maths_age_group') || '8-9';
  });

  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    return localStorage.getItem('maths_onboarded') === 'true';
  });

  const [level, setLevelState] = useState<DifficultyLevel>(() => {
    const saved = localStorage.getItem('maths_level');
    return saved ? (parseInt(saved, 10) as DifficultyLevel) : 2;
  });

  const [stars, setStars] = useState<number>(() => {
    const saved = localStorage.getItem('maths_stars');
    return saved ? parseInt(saved, 10) : 15;
  });

  const [coins, setCoins] = useState<number>(() => {
    const saved = localStorage.getItem('maths_coins');
    return saved ? parseInt(saved, 10) : 120;
  });

  const [gems, setGems] = useState<number>(() => {
    const saved = localStorage.getItem('maths_gems');
    return saved ? parseInt(saved, 10) : 8;
  });

  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('maths_streak');
    return saved ? parseInt(saved, 10) : 3;
  });

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('maths_stats');
    return saved ? JSON.parse(saved) : defaultStats;
  });

  const [realmProgress, setRealmProgress] = useState<Record<MathTopic, number[]>>(() => {
    const saved = localStorage.getItem('maths_realm_progress');
    if (saved) return JSON.parse(saved);
    // 5 levels per realm: Level 0 unlocked by default with 1 star, rest 0
    const initial: Record<MathTopic, number[]> = {
      addition: [3, 2, 0, 0, 0],
      subtraction: [2, 0, 0, 0, 0],
      multiplication: [1, 0, 0, 0, 0],
      division: [0, 0, 0, 0, 0],
      ratio: [0, 0, 0, 0, 0],
      percentage: [0, 0, 0, 0, 0],
    };
    return initial;
  });

  const [badges, setBadges] = useState<BadgeItem[]>(() => {
    const saved = localStorage.getItem('maths_badges');
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });

  const [shopGear, setShopGear] = useState<ShopGearItem[]>(() => {
    const saved = localStorage.getItem('maths_shop_gear');
    return saved ? JSON.parse(saved) : INITIAL_SHOP_GEAR;
  });

  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>(() => {
    const saved = localStorage.getItem('maths_daily_quests');
    return saved ? JSON.parse(saved) : initialQuests;
  });

  const [classroom, setClassroom] = useState<ClassroomData>(() => {
    const saved = localStorage.getItem('maths_classroom');
    return saved ? JSON.parse(saved) : defaultClassroom;
  });

  const [settings, setSettingsState] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('maths_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [recentRewardModal, setRecentRewardModal] = useState<{
    show: boolean;
    title: string;
    rewardText: string;
    icon: string;
  } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('maths_player_name', playerName);
  }, [playerName]);

  useEffect(() => {
    localStorage.setItem('maths_avatar', JSON.stringify(avatar));
  }, [avatar]);

  useEffect(() => {
    localStorage.setItem('maths_guide', guideCharacter);
  }, [guideCharacter]);

  useEffect(() => {
    localStorage.setItem('maths_age_group', ageGroup);
  }, [ageGroup]);

  useEffect(() => {
    localStorage.setItem('maths_onboarded', String(isOnboarded));
  }, [isOnboarded]);

  useEffect(() => {
    localStorage.setItem('maths_level', String(level));
  }, [level]);

  useEffect(() => {
    localStorage.setItem('maths_stars', String(stars));
  }, [stars]);

  useEffect(() => {
    localStorage.setItem('maths_coins', String(coins));
  }, [coins]);

  useEffect(() => {
    localStorage.setItem('maths_gems', String(gems));
  }, [gems]);

  useEffect(() => {
    localStorage.setItem('maths_streak', String(streak));
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('maths_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('maths_realm_progress', JSON.stringify(realmProgress));
  }, [realmProgress]);

  useEffect(() => {
    localStorage.setItem('maths_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('maths_shop_gear', JSON.stringify(shopGear));
  }, [shopGear]);

  useEffect(() => {
    localStorage.setItem('maths_daily_quests', JSON.stringify(dailyQuests));
  }, [dailyQuests]);

  useEffect(() => {
    localStorage.setItem('maths_classroom', JSON.stringify(classroom));
  }, [classroom]);

  // Automatic Local Caching & Server Synchronization on internet detection
  useEffect(() => {
    let playerId = localStorage.getItem('maths_player_id');
    if (!playerId) {
      playerId = `player-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      localStorage.setItem('maths_player_id', playerId);
    }

    const payload: SyncPayload = {
      playerId,
      playerName,
      stats,
      level,
      stars,
      coins,
      gems,
      streak,
      realmProgress,
      badges,
      clientTimestamp: new Date().toISOString(),
    };

    syncManager.queueStatsForSync(payload);
  }, [stats, level, stars, coins, gems, streak, realmProgress, badges, playerName]);

  useEffect(() => {
    localStorage.setItem('maths_settings', JSON.stringify(settings));
    soundManager.setEnabled(settings.soundEnabled);
    soundManager.setVolume(settings.soundVolume);

    // Document styling hooks for high contrast and reduced motion
    if (typeof document !== 'undefined') {
      if (settings.highContrast) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }

      if (settings.reducedMotion) {
        document.documentElement.classList.add('reduced-motion');
      } else {
        document.documentElement.classList.remove('reduced-motion');
      }

      if (settings.largeText) {
        document.documentElement.classList.add('text-lg');
      } else {
        document.documentElement.classList.remove('text-lg');
      }
    }
  }, [settings]);

  const updateAvatar = (newAvatar: Partial<CharacterAvatar>) => {
    setAvatarState((prev) => ({ ...prev, ...newAvatar }));
  };

  const setPlayerName = (name: string) => {
    setPlayerNameState(name);
  };

  const setGuideCharacter = (id: GuideCharacter['id']) => {
    setGuideCharacterState(id);
    soundManager.playSparkle();
  };

  const setAgeGroup = (age: string) => {
    setAgeGroupState(age);
  };

  const setLevel = (lvl: DifficultyLevel) => {
    setLevelState(lvl);
  };

  const addCoins = (amount: number) => {
    setCoins((prev) => prev + amount);
    soundManager.playSparkle();
  };

  const addStars = (amount: number) => {
    setStars((prev) => prev + amount);
    soundManager.playSparkle();
  };

  const addGems = (amount: number) => {
    setGems((prev) => prev + amount);
    soundManager.playSparkle();
  };

  const completeOnboarding = (
    name: string,
    age: string,
    initialLevel: DifficultyLevel,
    initialAvatar?: Partial<CharacterAvatar>
  ) => {
    setPlayerNameState(name);
    setAgeGroupState(age);
    setLevelState(initialLevel);
    if (initialAvatar) {
      setAvatarState((prev) => ({ ...prev, ...initialAvatar }));
    }
    setIsOnboarded(true);
    addCoins(50);
    addStars(5);
    fireCelebrationConfetti();
    soundManager.playCelebration();
    setRecentRewardModal({
      show: true,
      title: 'Welcome to Maths Adventure!',
      rewardText: 'You earned 50 Gold Coins 🪙 and 5 Stars ⭐ to begin your journey!',
      icon: '🎉',
    });
  };

  const unlockLevel = (topic: MathTopic, levelIdx: number, starsEarned: number) => {
    setRealmProgress((prev) => {
      const current = prev[topic] ? [...prev[topic]] : [0, 0, 0, 0, 0];
      current[levelIdx] = Math.max(current[levelIdx] || 0, starsEarned);
      // Unlock next level if exists
      if (levelIdx + 1 < current.length && current[levelIdx + 1] === 0) {
        current[levelIdx + 1] = 0; // ready to play
      }
      return { ...prev, [topic]: current };
    });
  };

  const recordAnswer = (topic: MathTopic, isCorrect: boolean, timeSeconds = 5) => {
    setStats((prev) => {
      const topicScoreKey = `${topic}Score` as keyof UserStats;
      const topicAnsweredKey = `${topic}Answered` as keyof UserStats;

      const newStats: UserStats = {
        ...prev,
        [topicAnsweredKey]: ((prev[topicAnsweredKey] as number) || 0) + 1,
        totalAnswered: prev.totalAnswered + 1,
        timeSpentSeconds: prev.timeSpentSeconds + timeSeconds,
      };

      if (isCorrect) {
        newStats[topicScoreKey] = ((prev[topicScoreKey] as number) || 0) + 1;
        newStats.totalCorrect = prev.totalCorrect + 1;
        newStats.streak = prev.streak + 1;
        newStats.bestStreak = Math.max(prev.bestStreak, newStats.streak);

        // Adaptive difficulty: if on streak of 5 correct, level up up to 7!
        if (newStats.streak > 0 && newStats.streak % 5 === 0 && level < 7) {
          setLevelState((curr) => Math.min(7, (curr + 1) as DifficultyLevel) as DifficultyLevel);
          setRecentRewardModal({
            show: true,
            title: 'Level Up!',
            rewardText: `Amazing streak! You advanced to Difficulty Level ${Math.min(7, level + 1)}!`,
            icon: '⚡',
          });
          fireStarBurst();
        }
      } else {
        newStats.streak = 0;
      }

      return newStats;
    });

    // Update daily quests
    setDailyQuests((prev) =>
      prev.map((q) => {
        if (q.topic === topic && isCorrect && !q.completed) {
          const nextCount = q.currentCount + 1;
          const isDone = nextCount >= q.targetCount;
          return { ...q, currentCount: nextCount, completed: isDone };
        }
        return q;
      })
    );

    // Auto-unlock badges based on accomplishments
    if (isCorrect) {
      checkBadges(topic);
    }
  };

  const checkBadges = (topic: MathTopic) => {
    setBadges((prev) => {
      const updated = [...prev];
      const unlockBadge = (id: string) => {
        const idx = updated.findIndex((b) => b.id === id);
        if (idx !== -1 && !updated[idx].unlockedAt) {
          updated[idx] = { ...updated[idx], unlockedAt: new Date().toISOString() };
          fireCelebrationConfetti();
          soundManager.playCelebration();
          setRecentRewardModal({
            show: true,
            title: `Badge Unlocked: ${updated[idx].title}!`,
            rewardText: updated[idx].description,
            icon: updated[idx].icon,
          });
        }
      };

      unlockBadge('first_adventure');
      if (topic === 'addition') unlockBadge('addition_ace');
      if (topic === 'subtraction') unlockBadge('subtraction_star');
      if (topic === 'multiplication') unlockBadge('multiplication_master');
      if (topic === 'division') unlockBadge('division_champion');
      if (topic === 'ratio') unlockBadge('ratio_ranger');
      if (topic === 'percentage') unlockBadge('percentage_pro');

      return updated;
    });
  };

  const buyShopItem = (item: ShopGearItem): boolean => {
    if (coins < item.price) {
      soundManager.playGentleBoop();
      return false;
    }

    setCoins((prev) => prev - item.price);
    setShopGear((prev) =>
      prev.map((g) => (g.id === item.id ? { ...g, unlocked: true } : g))
    );

    // Equip item immediately
    updateAvatar({ [item.category]: item.value });
    soundManager.playSparkle();
    fireStarBurst();
    return true;
  };

  const claimDailyQuest = (questId: string) => {
    const q = dailyQuests.find((item) => item.id === questId);
    if (!q || !q.completed) return;

    addCoins(q.rewardCoins);
    addStars(q.rewardStars);
    soundManager.playCelebration();
    fireCelebrationConfetti();

    // Mark as claimed
    setDailyQuests((prev) => prev.filter((item) => item.id !== questId));
    setRecentRewardModal({
      show: true,
      title: 'Quest Completed!',
      rewardText: `You claimed +${q.rewardCoins} Coins 🪙 and +${q.rewardStars} Stars ⭐!`,
      icon: '🎁',
    });
  };

  const updateClassroom = (data: ClassroomData) => {
    setClassroom(data);
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettingsState((prev) => ({ ...prev, ...newSettings }));
  };

  const dismissRewardModal = () => {
    setRecentRewardModal(null);
  };

  const resetAllData = () => {
    localStorage.clear();
    setPlayerNameState('Adventurer');
    setAvatarState(defaultAvatar);
    setGuideCharacterState('milo');
    setAgeGroupState('8-9');
    setIsOnboarded(false);
    setLevelState(2);
    setStars(15);
    setCoins(120);
    setGems(8);
    setStreak(3);
    setStats(defaultStats);
    setBadges(INITIAL_BADGES);
    setShopGear(INITIAL_SHOP_GEAR);
    setDailyQuests(initialQuests);
    setClassroom(defaultClassroom);
    setSettingsState(defaultSettings);
    soundManager.playClick();
  };

  return (
    <GameContext.Provider
      value={{
        playerName,
        setPlayerName,
        avatar,
        updateAvatar,
        guideCharacter,
        setGuideCharacter,
        ageGroup,
        setAgeGroup,
        isOnboarded,
        completeOnboarding,
        level,
        setLevel,
        stars,
        coins,
        gems,
        streak,
        addCoins,
        addStars,
        addGems,
        realmProgress,
        unlockLevel,
        stats,
        recordAnswer,
        badges,
        shopGear,
        buyShopItem,
        dailyQuests,
        claimDailyQuest,
        classroom,
        updateClassroom,
        settings,
        updateSettings,
        recentRewardModal,
        dismissRewardModal,
        resetAllData,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
