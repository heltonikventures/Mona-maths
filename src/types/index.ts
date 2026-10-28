export type MathTopic = 
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'ratio'
  | 'percentage';

export type GameMode = 
  | 'adventure'
  | 'quickplay'
  | 'time-challenge'
  | 'boss-battle'
  | 'memory'
  | 'number-race'
  | 'daily';

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface DifficultyTitle {
  level: DifficultyLevel;
  name: string;
  badge: string;
  color: string;
}

export interface CharacterAvatar {
  gender: 'boy' | 'girl' | 'robot' | 'animal';
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  clothingColor: string;
  hat: string; // 'none' | 'crown' | 'cap' | 'explorer' | 'wizard' | 'astronaut'
  glasses: string; // 'none' | 'round' | 'star' | 'goggles'
  accessory: string; // 'none' | 'backpack' | 'jetpack' | 'cape' | 'magic-wand'
}

export interface GuideCharacter {
  id: 'milo' | 'luna' | 'bobo' | 'pip' | 'zara';
  name: string;
  title: string;
  color: string;
  avatarBg: string;
  catchphrase: string;
  avatarSvg: string;
}

export interface VisualAidData {
  type: 'fruit' | 'grid100' | 'array' | 'sharing' | 'ratio-bars' | 'counter-blocks';
  itemEmoji?: string;
  countA?: number;
  countB?: number;
  total?: number;
  gridTotal?: number;
  gridShaded?: number;
  rows?: number;
  cols?: number;
  groups?: number;
  itemsPerGroup?: number;
  remainder?: number;
  ratioA?: { label: string; count: number; color: string; emoji: string };
  ratioB?: { label: string; count: number; color: string; emoji: string };
}

export interface MathQuestion {
  id: string;
  topic: MathTopic;
  difficulty: DifficultyLevel;
  questionText: string;
  storyContext?: string;
  equationText?: string;
  visualAid?: VisualAidData;
  options: (string | number)[];
  correctAnswer: string | number;
  hints: string[];
  explanation: string;
  format: 'multiple-choice' | 'number-pad' | 'drag-drop' | 'visual-match';
}

export interface RealmConfig {
  id: MathTopic;
  name: string;
  subtitle: string;
  icon: string;
  themeColor: string;
  bgGradient: string;
  cardColor: string;
  levelsCount: number;
  description: string;
  bossName: string;
  bossTitle: string;
}

export interface UserStats {
  additionScore: number;
  subtractionScore: number;
  multiplicationScore: number;
  divisionScore: number;
  ratioScore: number;
  percentageScore: number;
  
  additionAnswered: number;
  subtractionAnswered: number;
  multiplicationAnswered: number;
  divisionAnswered: number;
  ratioAnswered: number;
  percentageAnswered: number;

  totalCorrect: number;
  totalAnswered: number;
  streak: number;
  bestStreak: number;
  timeSpentSeconds: number;
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  topic?: MathTopic;
  unlockedAt?: string;
  color: string;
}

export interface ShopGearItem {
  id: string;
  name: string;
  category: 'hat' | 'glasses' | 'accessory' | 'clothingColor' | 'hairStyle';
  value: string;
  price: number;
  icon: string;
  unlocked: boolean;
  colorPreview?: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  topic: MathTopic;
  targetCount: number;
  currentCount: number;
  rewardCoins: number;
  rewardStars: number;
  completed: boolean;
}

export interface StudentProfile {
  id: string;
  name: string;
  avatarChar: string;
  level: number;
  stars: number;
  coins: number;
  accuracy: number;
  assignedTopic?: MathTopic;
  lastActive: string;
}

export interface ClassroomData {
  className: string;
  code: string;
  teacherName: string;
  assignedTopic: MathTopic | 'all';
  assignedDifficulty: DifficultyLevel;
  students: StudentProfile[];
}

export interface UserSettings {
  soundEnabled: boolean;
  soundVolume: number;
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  leaderboardEnabled: boolean;
}
