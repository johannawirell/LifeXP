import type { GoalDifficulty, GoalTemplateCategory } from '../../generated/client';

export const GOAL_DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD', 'EPIC', 'LEGENDARY'] as const;
export const GOAL_STRUCTURE_TYPES = ['SINGLE', 'MILESTONE_PATH'] as const;

export const CATEGORY_COLORS = {
  training: '#73D86A',
  health: '#F08A45',
  job: '#5E8BFF',
  learning: '#B269FF',
  social: '#FF77C8',
  finance: '#56D2C5',
} as const;

export const CATEGORY_COLOR_BY_TEMPLATE_CATEGORY: Record<GoalTemplateCategory, string> = {
  TRAINING: CATEGORY_COLORS.training,
  HEALTH: CATEGORY_COLORS.health,
  JOB: CATEGORY_COLORS.job,
  STUDY: CATEGORY_COLORS.learning,
  RELATIONSHIP: CATEGORY_COLORS.social,
  FINANCE: CATEGORY_COLORS.finance,
};

export const CATEGORY_LABELS: Record<GoalTemplateCategory, string> = {
  TRAINING: 'Träning',
  HEALTH: 'Hälsa',
  JOB: 'Jobb',
  STUDY: 'Plugg',
  RELATIONSHIP: 'Relationer',
  FINANCE: 'Ekonomi',
};

export const GOAL_SUBTITLES = {
  training: 'training',
  running: 'running',
  strength: 'strength',
  health: 'health',
  learning: 'learning',
  job: 'job',
  social: 'social',
  finance: 'finance',
  football: 'football',
  riding: 'riding',
} as const;

export const GOAL_ICONS = {
  wallet: 'wallet-outline',
  cash: 'cash-outline',
  bicycle: 'bicycle-outline',
  ban: 'ban-outline',
  calendar: 'calendar-outline',
  leaf: 'leaf-outline',
  fitness: 'fitness-outline',
  school: 'school-outline',
  briefcase: 'briefcase-outline',
  body: 'body-outline',
  heart: 'heart-outline',
  people: 'people-outline',
  home: 'home-outline',
  paw: 'paw-outline',
  timer: 'timer-outline',
  walk: 'walk-outline',
  barbell: 'barbell-outline',
} as const;

export type GoalSubtitleSeed = (typeof GOAL_SUBTITLES)[keyof typeof GOAL_SUBTITLES];
export type GoalIconSeed = (typeof GOAL_ICONS)[keyof typeof GOAL_ICONS];
export type GoalStructureTypeSeed = (typeof GOAL_STRUCTURE_TYPES)[number];

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

export type GoalTemplateSeed = {
  title: string;
  icon: GoalIconSeed;
  subtitle: GoalSubtitleSeed[];
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
};

export function defineSharedQuest(quest: GoalTemplateQuestSeed): GoalTemplateQuestSeed {
  return quest;
}

export function defineTemplate(template: GoalTemplateSeed): GoalTemplateSeed {
  return {
    ...template,
    color: template.color ?? CATEGORY_COLOR_BY_TEMPLATE_CATEGORY[template.category],
    structureType:
      template.structureType ??
      (template.milestones.length <= 1 ? GOAL_STRUCTURE_TYPES[0] : GOAL_STRUCTURE_TYPES[1]),
  };
}
