import type { GoalTemplateCategory } from '../../generated/client';

export type GoalTemplateMilestoneSeed = {
  title: string;
  description?: string;
  subtasks?: string[];
  tips?: string[];
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
  color: string;
  isPopular: boolean;
  details: GoalTemplateDetailSeed[];
  milestones: GoalTemplateMilestoneSeed[];
};
