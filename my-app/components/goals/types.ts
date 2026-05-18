export type QuestCard = {
  id: string;
  goalId?: string;
  title: string;
  description?: string;
  type: 'DAILY' | 'WEEKLY';
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EPIC' | 'LEGENDARY';
  xpReward: number;
  progress: number;
  progressLabel: string;
  completed: boolean;
  streakCount: number;
  color: string;
};

export type GoalCard = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EPIC' | 'LEGENDARY';
  progress: number;
  percentLabel: string;
  color: string;
  leftMeta: string;
  rightMeta: string;
  totalXpReward: number;
  goalXpReward: number;
  quests: QuestCard[];
  milestones: {
    id: string;
    title: string;
    description?: string;
    xpReward: number;
    completed: boolean;
    completedLabel?: string;
    subtasks: {
      id: string;
      title: string;
      completed: boolean;
    }[];
    tips: {
      id: string;
      text: string;
    }[];
  }[];
};

export type GoalsPageResponse = {
  overview: {
    activeGoals: number;
    averageProgress: string;
    completedMilestones: number;
    streakDays: number;
    totalQuestXp: number;
  };
  dailyQuests: QuestCard[];
  weeklyQuests: QuestCard[];
  activeGoals: GoalCard[];
  completedGoals: GoalCard[];
};

export type GoalsMutationReward = {
  milestoneXp?: number;
  goalBonusXp?: number;
  questXp?: number;
  totalXp: number;
  title: string;
};

export type GoalsMutationResponse = {
  page: GoalsPageResponse;
  reward?: GoalsMutationReward | null;
};

export type GoalTab = 'active' | 'completed';

export type GoalCategoryFilter =
  | 'latest'
  | 'job'
  | 'study'
  | 'training'
  | 'health'
  | 'finance'
  | 'relationship';
