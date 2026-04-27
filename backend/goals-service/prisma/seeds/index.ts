import type { GoalTemplateSeed } from './template-seed-types';
import { financeGoalTemplates } from './finance';
import { healthGoalTemplates } from './health';
import { jobGoalTemplates } from './job';
import { relationshipGoalTemplates } from './relationship';
import { studyGoalTemplates } from './study';
import { trainingGoalTemplates } from './training';

export const goalTemplateSeeds: GoalTemplateSeed[] = [
  ...trainingGoalTemplates,
  ...studyGoalTemplates,
  ...healthGoalTemplates,
  ...jobGoalTemplates,
  ...financeGoalTemplates,
  ...relationshipGoalTemplates,
];
