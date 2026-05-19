import type { GoalDifficulty, GoalTemplateCategory } from '../../generated/client';

export type GoalTemplateMilestoneSeed = {
  title: string;
  description?: string;
  xpReward?: number;
  subtasks?: string[];
  tips?: string[];
};

export type GoalTemplateQuestSeed = {
  sharedKey?: string;
  title: string;
  description?: string;
  xpReward?: number;
  frequency: 'DAILY' | 'WEEKLY';
};
export type GoalStructureTypeSeed = 'SINGLE' | 'MILESTONE_PATH';

export type GoalTemplateSeed = {
  title: string;
  icon: string;
  subtitle: string[];
  summaryDescription: string;
  category: GoalTemplateCategory;
  difficulty: GoalDifficulty;
  focusLabel?: string;
  structureType?: GoalStructureTypeSeed;
  totalXpReward: number;
  color: string;
  isPopular: boolean;
  milestones: GoalTemplateMilestoneSeed[];
  quests?: GoalTemplateQuestSeed[];
  // Deprecated legacy seed fields kept temporarily so older seed objects still compile during migration.
  detailDescription?: string;
  goalXpReward?: number;
  details?: {
    label: string;
    value: string;
    visibility: 'SUMMARY' | 'DETAIL' | 'BOTH';
  }[];
};
