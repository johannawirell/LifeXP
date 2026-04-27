import type { GoalTemplateSeed } from './template-seed-types';

export const jobGoalTemplates: GoalTemplateSeed[] = [
  {
    title: 'Bli redo för en befordran',
    icon: 'briefcase-outline',
    subtitle: 'Jobb',
    summaryDescription: 'Utveckla dina skills och ta nästa steg i karriären.',
    detailDescription:
      'Det här målet hjälper dig att bli tydligare i vilken roll du siktar på, vilka kompetenser som behöver stärkas och hur du vågar ta nästa steg.',
    category: 'JOB',
    color: '#5E8BFF',
    isPopular: true,
    details: [
      { label: 'Kategori', value: 'Jobb', visibility: 'SUMMARY' },
      { label: 'Upplägg', value: '5 utvecklingssteg', visibility: 'SUMMARY' },
      { label: 'Fokus', value: 'Karriär, utveckling', visibility: 'DETAIL' }
    ],
    milestones: [
      { title: 'Definiera rollen du vill nå' },
      { title: 'Utveckla saknade kompetenser' },
      { title: 'Visa initiativ' },
      { title: 'Dokumentera dina framsteg' },
      { title: 'Be om feedback' },
      { title: 'Be om ett utvecklingssamtal' },
      { title: 'Ta samtalet' },
    ],
  },
  {
    title: 'Byta jobb inom 6 månader',
    icon: 'briefcase-outline',
    subtitle: 'Jobb',
    summaryDescription: 'Bygg en konkret plan för att hitta och landa ett nytt jobb.',
    detailDescription:
      'Målet bryter ner jobbytet i tydliga steg så att du kan arbeta strukturerat med riktning, ansökningar, intervjuer och uppföljning.',
    category: 'JOB',
    color: '#5E8BFF',
    isPopular: false,
    details: [
      { label: 'Kategori', value: 'Jobb', visibility: 'SUMMARY' },
      { label: 'Tidsram', value: '6 månader', visibility: 'SUMMARY' },
      { label: 'Fokus', value: 'CV, ansökningar och intervjuträning', visibility: 'DETAIL' },
      { label: 'Passar dig som', value: 'vill byta roll, bransch eller arbetsgivare', visibility: 'DETAIL' },
    ],
    milestones: [
      { title: 'Bestäm vilken typ av roller du söker' },
      { title: 'Uppdatera CV och LinkedIn' },
      { title: 'Sök ett visst antal jobb varje vecka' },
      { title: 'Öva på intervjufrågor' },
      { title: 'Genomför och följ upp intervjuer' },
    ],
  },
];
