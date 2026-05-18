import type { GoalTemplateSeed } from '../template-seed-types';
import { runningGoals } from './subcategories/running';
import { streangthGoals } from './subcategories/strength';

export const trainingGoalTemplates: GoalTemplateSeed[] = [
 ...runningGoals,
  ...streangthGoals,
];
