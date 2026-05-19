import Ionicons from '@expo/vector-icons/Ionicons';

export type ProfileResponse = {
  id: string;
  displayName: string;
  headline: string | null;
  currentLevel: number;
  totalXp: number;
  nextLevelXp: number;
  xpToNextLevel: number;
  levelProgress: number;
  currentStreak: number;
  bestStreak: number;
  focusAreas: {
    id: string;
    key: string;
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    isSelected?: boolean;
    level: number;
    currentXp: number;
    maxXp: number;
    color: string;
  }[];
  activeGoals: {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
    progress: number;
    color: string;
    percentLabel: string;
  }[];
  dailyQuests: {
    id: string;
    goalId?: string;
    title: string;
    xpReward: number;
    progressLabel: string;
    completed: boolean;
    color: string;
  }[];
  weeklyQuests: {
    id: string;
    goalId?: string;
    title: string;
    xpReward: number;
    progressLabel: string;
    completed: boolean;
    color: string;
  }[];
  recentXp: {
    id: string;
    amount: number;
    title: string;
    description: string;
    category?: string | null;
    multiplier: number;
  }[];
  achievements: {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
    color: string;
    rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  }[];
  weeklyStats: {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    value: string;
    label: string;
    detail: string;
    color: string;
  }[];
  statisticsSummary: {
    totalXp: number;
    level: number;
    xpToNextLevel: number;
    completedQuests: number;
    completedGoals: number;
    currentStreak: number;
  };
};
