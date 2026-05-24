import type { GoalTemplateSeed } from '../template-seed-types';
import { runningGoals } from './subcategories/running';
import { strengthGoals } from './subcategories/strength';
import { cyclingGoals } from './subcategories/cycling';

export const trainingGoalTemplates: GoalTemplateSeed[] = [
 ...runningGoals,
  ...strengthGoals,
  ...cyclingGoals,
];
