import type { GoalTemplateQuestSeed } from '../../template-seed-types';

export const runningSharedQuests: GoalTemplateQuestSeed[] = [
  {
    sharedKey: 'running-daily-get-out',
    title: 'Ta dig ut',
    description: 'Gå eller jogga minst 10 minuter.',
    xpReward: 20,
    frequency: 'DAILY',
  },
  {
    sharedKey: 'running-weekly-three-sessions',
    title: 'Tre löppass',
    description: 'Genomför minst 3 löp- eller konditionspass denna vecka.',
    xpReward: 100,
    frequency: 'WEEKLY',
  },
  {
    sharedKey: 'running-weekly-distance',
    title: 'Veckans distans',
    description: 'Samla ihop minst 5 km gång eller löpning under veckan.',
    xpReward: 150,
    frequency: 'WEEKLY',
  },
];

export const strengthSharedQuests: GoalTemplateQuestSeed[] = [
  
];
