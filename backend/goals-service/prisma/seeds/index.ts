import type { GoalTemplateSeed } from './template-seed-types';
import { financeGoalTemplates } from './finance/finance';
import { healthGoalTemplates } from './health/health';
import { jobGoalTemplates } from './job/job';
import { relationshipGoalTemplates } from './relationship/relationship';
import { studyGoalTemplates } from './study/study';
import { trainingGoalTemplates } from './training/training';

export const goalTemplateSeeds: GoalTemplateSeed[] = [
  ...trainingGoalTemplates,
  ...studyGoalTemplates,
  ...healthGoalTemplates,
  ...jobGoalTemplates,
  ...financeGoalTemplates,
  ...relationshipGoalTemplates,
];
