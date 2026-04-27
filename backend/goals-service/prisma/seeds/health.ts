import type { GoalTemplateSeed } from './template-seed-types';

export const healthGoalTemplates: GoalTemplateSeed[] = [
  {
    title: 'Sluta med alkohol',
    icon: 'ban-outline',
    subtitle: 'Hälsa',
    description: 'Bygg nya vanor och bli helt fri från alkohol.',
    category: 'HEALTH',
    color: '#F08A45',
    isPopular: true,
    milestones: [
      { title: 'Identifiera triggers och risksituationer' },
      { title: 'Skapa en plan för helger och sociala tillfällen' },
      { title: 'Byt ut alkohol mot nya vanor' },
      { title: 'Logga nyktra dagar' },
      { title: 'Nå första 30 dagarna alkoholfri' },
    ],
  },
  {
    title: 'Minska stress',
    icon: 'leaf-outline',
    subtitle: 'Hälsa',
    description: 'Skapa lugn i vardagen och må bättre mentalt.',
    category: 'HEALTH',
    color: '#67D86F',
    isPopular: true,
    milestones: [
      { title: 'Kartlägg vad som stressar dig mest' },
      { title: 'Skapa en lugn morgon- eller kvällsrutin' },
      { title: 'Avsätt tid för återhämtning varje dag' },
      { title: 'Minska en onödig belastning i veckan' },
      { title: 'Utvärdera energinivå och sömn efter 2 veckor' },
    ],
  },
  {
    title: 'Gå ner 5 kg',
    icon: 'fitness-outline',
    subtitle: 'Hälsa',
    description: 'Skapa hållbara vanor kring kost, rörelse och återhämtning.',
    category: 'HEALTH',
    color: '#F08A45',
    isPopular: false,
    milestones: [
      { title: 'Sätt ett realistiskt kalori- och aktivitetsmål' },
      { title: 'Planera måltider för veckan' },
      { title: 'Rör dig minst 30 minuter om dagen' },
      { title: 'Följ upp vikt och mått varje vecka' },
      { title: 'Justera planen efter första månaden' },
    ],
  },
];
