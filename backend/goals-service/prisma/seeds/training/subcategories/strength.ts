import type { GoalTemplateSeed } from '../../template-seed-types';

export const streangthGoals: GoalTemplateSeed[] = [
 {
    title: 'Bygga muskler',
    icon: 'barbell-outline',
    subtitle: 'Träning',
    summaryDescription: 'Träna regelbundet och bygg styrka över tid.',
    detailDescription:
      'Målet fokuserar på att skapa kontinuitet i styrketräningen, sätta kostramar och följa din utveckling över tid.',
    category: 'TRAINING',
    difficulty: 'MEDIUM',
    goalXpReward: 150,
    totalXpReward: 550,
    color: '#F5C13C',
    isPopular: true,
    details: [
      { label: 'Kategori', value: 'Träning', visibility: 'SUMMARY' },
      { label: 'Upplägg', value: 'utvecklingssteg', visibility: 'SUMMARY' },
      { label: 'Fokus', value: 'Progressiv överbelastning och uppföljning', visibility: 'DETAIL' },
      { label: 'Passar dig som', value: 'vill bygga styrka och muskelmassa strukturerat', visibility: 'DETAIL' },
    ],
    milestones: [
      { title: 'Skapa ett träningsschema för veckan', xpReward: 40 },
      { title: 'Sätt mål för kost och proteinintag', xpReward: 50 },
      { title: 'Träna 3 styrkepass i veckan', xpReward: 100 },
      { title: 'Öka belastningen gradvis', xpReward: 100 },
      { title: 'Följ upp styrka och kroppsmått', xpReward: 110 },
    ],
  }
];