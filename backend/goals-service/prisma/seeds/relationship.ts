import type { GoalTemplateSeed } from './template-seed-types';

export const relationshipGoalTemplates: GoalTemplateSeed[] = [
  {
    title: 'Stärka relationen med partnern',
    icon: 'heart-outline',
    subtitle: 'Relationer',
    description: 'Skapa mer kvalitetstid, bättre kommunikation och tydliga vanor tillsammans.',
    category: 'RELATIONSHIP',
    color: '#FF77C8',
    isPopular: true,
    milestones: [
      { title: 'Prata om vad ni båda vill förbättra' },
      { title: 'Planera in regelbunden kvalitetstid' },
      { title: 'Skapa bättre vanor för kommunikation' },
      { title: 'Följ upp hur det känns efter två veckor' },
      { title: 'Justera gemensamma rutiner' },
    ],
  },
  {
    title: 'Utöka mitt sociala nätverk',
    icon: 'people-outline',
    subtitle: 'Relationer',
    description: 'Bygg fler meningsfulla relationer i vardagen.',
    category: 'RELATIONSHIP',
    color: '#7A8CFF',
    isPopular: false,
    milestones: [
      { title: 'Identifiera sammanhang där du kan träffa nya personer' },
      { title: 'Ta initiativ till en ny social aktivitet' },
      { title: 'Håll kontakt med minst två nya personer' },
      { title: 'Boka in en uppföljande träff eller fika' },
      { title: 'Bygg en återkommande social rutin' },
    ],
  },
];
