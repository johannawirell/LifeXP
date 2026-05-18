import type { GoalTemplateSeed } from './template-seed-types';
import { financeGoalTemplates } from './finance/finance';
import { healthGoalTemplates } from './health/health';
import { jobGoalTemplates } from './job/job';
import { learningGoalTemplates } from './learning/learning';
import { socialGoalTemplates } from './social/social';
import { trainingGoalTemplates } from './training/training';

export const goalTemplateSeeds: GoalTemplateSeed[] = [
  ...trainingGoalTemplates,
  ...learningGoalTemplates,
  ...healthGoalTemplates,
  ...jobGoalTemplates,
  ...financeGoalTemplates,
  ...socialGoalTemplates,
];
