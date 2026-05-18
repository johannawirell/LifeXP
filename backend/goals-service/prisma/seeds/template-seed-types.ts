import type { GoalDifficulty, GoalTemplateCategory } from '../../generated/client';

export type GoalTemplateMilestoneSeed = {
  title: string;
  description?: string;
  xpReward?: number;
  subtasks?: string[];
  tips?: string[];
};

export type GoalTemplateQuestSeed = {
  title: string;
  description?: string;
  xpReward?: number;
  frequency: 'DAILY' | 'WEEKLY';
};

export type GoalTemplateDetailSeed = {
  label: string;
  value: string;
  visibility: 'SUMMARY' | 'DETAIL' | 'BOTH';
};

export type GoalTemplateSeed = {
  title: string;
  icon: string;
  subtitle: string;
  summaryDescription: string;
  detailDescription: string;
  category: GoalTemplateCategory;
  difficulty: GoalDifficulty;
  goalXpReward: number;
  totalXpReward: number;
  color: string;
  isPopular: boolean;
  details: GoalTemplateDetailSeed[];
  milestones: GoalTemplateMilestoneSeed[];
  quests?: GoalTemplateQuestSeed[];
};
