import type { GoalTemplateCategory } from '../../generated/client';

export type GoalTemplateMilestoneSeed = {
  title: string;
  description?: string;
};

export type GoalTemplateSeed = {
  title: string;
  icon: string;
  subtitle: string;
  description: string;
  category: GoalTemplateCategory;
  color: string;
  isPopular: boolean;
  milestones: GoalTemplateMilestoneSeed[];
};
