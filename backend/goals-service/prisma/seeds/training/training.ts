import type { GoalTemplateSeed } from '../template-seed-types';
import { runningGoals } from './subcategories/running';
import { strengthGoals } from './subcategories/strength';

export const trainingGoalTemplates: GoalTemplateSeed[] = [
 ...runningGoals,
  ...strengthGoals,
];
