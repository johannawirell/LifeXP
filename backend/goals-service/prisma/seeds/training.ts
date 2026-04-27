import type { GoalTemplateSeed } from './template-seed-types';

export const trainingGoalTemplates: GoalTemplateSeed[] = [
  {
    title: 'Springa 5 km',
    icon: 'walk-outline',
    subtitle: 'Träning',
    description: 'Bygg upp din kondition och spring 5 km utan att stanna.',
    category: 'TRAINING',
    color: '#73D86A',
    isPopular: true,
    milestones: [
      { title: 'Spring 1 km utan paus' },
      { title: 'Spring 2 km i lugnt tempo' },
      { title: 'Spring 3 km sammanhängande' },
      { title: 'Spring 4 km med jämnt tempo' },
      { title: 'Spring 5 km utan att stanna' },
    ],
  },
  {
    title: 'Bygga muskler',
    icon: 'barbell-outline',
    subtitle: 'Träning',
    description: 'Träna regelbundet och bygg styrka över tid.',
    category: 'TRAINING',
    color: '#F5C13C',
    isPopular: true,
    milestones: [
      { title: 'Skapa ett träningsschema för veckan' },
      { title: 'Sätt mål för kost och proteinintag' },
      { title: 'Träna 3 styrkepass i veckan' },
      { title: 'Öka belastningen gradvis' },
      { title: 'Följ upp styrka och kroppsmått' },
    ],
  },
  {
    title: 'Springa halvmaraton',
    icon: 'walk-outline',
    subtitle: 'Träning',
    description: 'Träna stegvis för att kunna genomföra ett halvmaraton.',
    category: 'TRAINING',
    color: '#73D86A',
    isPopular: false,
    milestones: [
      { title: 'Skapa ett 12-veckors träningsupplägg' },
      { title: 'Bygg upp veckovolymen gradvis' },
      { title: 'Lägg in ett långpass varje vecka' },
      { title: 'Träna tempo och återhämtning' },
      { title: 'Genomför loppet' },
    ],
  },
];
