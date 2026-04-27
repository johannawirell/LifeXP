import type { GoalTemplateSeed } from './template-seed-types';

export const studyGoalTemplates: GoalTemplateSeed[] = [
  {
    title: 'Klara en kurs',
    icon: 'school-outline',
    subtitle: 'Plugg',
    description: 'Följ en plan och klara din kurs med bra resultat.',
    category: 'STUDY',
    color: '#B269FF',
    isPopular: true,
    milestones: [
      { title: 'Gör en studieplan för kursen' },
      { title: 'Dela upp kursen i veckomål' },
      { title: 'Gör alla inlämningar i tid' },
      { title: 'Repetera inför examination' },
      { title: 'Genomför tentan eller slutuppgiften' },
    ],
  },
  {
    title: 'Ta examen',
    icon: 'school-outline',
    subtitle: 'Plugg',
    description: 'Planera dina studier så att du klarar alla moment innan examen.',
    category: 'STUDY',
    color: '#B269FF',
    isPopular: false,
    milestones: [
      { title: 'Lista alla kvarvarande kurser och deadlines' },
      { title: 'Planera terminen vecka för vecka' },
      { title: 'Boka studietid i kalendern' },
      { title: 'Slutför uppgifter i förväg' },
      { title: 'Följ upp studieplanen varje vecka' },
    ],
  },
  {
    title: 'Ta körkort',
    icon: 'school-outline',
    subtitle: 'Plugg',
    description: 'Heja',
    category: 'STUDY',
    color: '#B269FF',
    isPopular: false,
    milestones: [
      { title: 'del 1' },
    ],
  },
];
