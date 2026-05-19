import type Ionicons from '@expo/vector-icons/Ionicons';

export type GoalDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EPIC' | 'LEGENDARY';
export type DifficultyFilter = 'ALL' | GoalDifficulty;
export type IoniconName = keyof typeof Ionicons.glyphMap;

export type GoalTemplateSummary = {
  id: string;
  title: string;
  icon: IoniconName;
  subtitle: string[];
  summaryDescription: string;
  category: string;
  difficulty: GoalDifficulty;
  color: string;
  totalXpReward: number;
  overviewItems: {
    id: string;
    label: string;
    value: string;
    icon?: IoniconName;
  }[];
  milestones: {
    id: string;
    title: string;
    subtasks: { id: string; title: string }[];
    tips: { id: string; text: string }[];
  }[];
  quests: {
    id: string;
    title: string;
    description?: string;
    frequency: 'DAILY' | 'WEEKLY';
    xpReward: number;
  }[];
};

export type GoalTemplatePageResponse = {
  steps: { id: number; label: string; complete: boolean }[];
  categories: { key: string; label: string; icon: IoniconName; active: boolean }[];
  selectedCategory: string;
  templates: GoalTemplateSummary[];
};

export type GoalTemplateDetailResponse = {
  id: string;
  title: string;
  icon: IoniconName;
  subtitle: string[];
  summaryDescription: string;
  category: string;
  color: string;
  overviewItems: { id: string; label: string; value: string; icon?: IoniconName }[];
  difficulty: GoalDifficulty;
  totalXpReward: number;
  milestones: {
    id: string;
    title: string;
    description?: string;
    xpReward: number;
    subtasks: { id: string; title: string }[];
    tips: { id: string; text: string }[];
  }[];
  quests: {
    id: string;
    title: string;
    description?: string;
    frequency: 'DAILY' | 'WEEKLY';
    xpReward: number;
  }[];
};

export type EditableTemplateDraft = {
  id?: string;
  title: string;
  subtitle: string;
  category: string;
  color: string;
  icon: IoniconName;
  difficulty: GoalDifficulty;
  totalXpReward: number;
  milestones: {
    id: string;
    title: string;
    description?: string;
    xpReward: number;
    subtasks: { id: string; title: string }[];
    tips: { id: string; text: string }[];
  }[];
};

export type CreateGoalResponse = {
  goalId: string;
  userId: string;
  templateId: string;
  message: string;
};
