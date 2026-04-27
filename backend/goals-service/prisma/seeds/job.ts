import type { GoalTemplateSeed } from './template-seed-types';

export const jobGoalTemplates: GoalTemplateSeed[] = [
  {
    title: 'Bli redo för en befordran',
    icon: 'briefcase-outline',
    subtitle: 'Jobb',
    description: 'Utveckla dina skills och ta nästa steg i karriären.',
    category: 'JOB',
    color: '#5E8BFF',
    isPopular: true,
    milestones: [
      { title: 'Definiera rollen du vill ta nästa steg mot' },
      { title: 'Identifiera vilka skills som saknas' },
      { title: 'Ta ansvar för ett synligt projekt' },
      { title: 'Be om feedback från chef eller mentor' },
      { title: 'Be om ett utvecklingssamtal om nästa steg' },
    ],
  },
  {
    title: 'Byta jobb inom 6 månader',
    icon: 'briefcase-outline',
    subtitle: 'Jobb',
    description: 'Bygg en konkret plan för att hitta och landa ett nytt jobb.',
    category: 'JOB',
    color: '#5E8BFF',
    isPopular: false,
    milestones: [
      { title: 'Bestäm vilken typ av roller du söker' },
      { title: 'Uppdatera CV och LinkedIn' },
      { title: 'Sök ett visst antal jobb varje vecka' },
      { title: 'Öva på intervjufrågor' },
      { title: 'Genomför och följ upp intervjuer' },
    ],
  },
];
