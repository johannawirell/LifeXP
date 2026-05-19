import { defineSharedQuest, type GoalTemplateQuestSeed } from '../template-seed-types';

export const EverydaySavingSharedQuests: GoalTemplateQuestSeed[] = [
  defineSharedQuest({
    title: 'Laga mat hemma',
    description: 'Laga mat hemma istället för att äta ute.',
    xpReward: 20,
    frequency: 'DAILY',
  }),
];
