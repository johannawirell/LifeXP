import type { GoalTemplateSeed } from './template-seed-types';

export const studyGoalTemplates: GoalTemplateSeed[] = [
  {
    title: 'Klara en kurs',
    icon: 'school-outline',
    subtitle: 'Plugg',
    summaryDescription: 'Följ en plan och klara din kurs med bra resultat.',
    detailDescription:
      'Det här målet hjälper dig att bryta ner kursen i tydliga studiesteg, hålla deadlines och skapa ett lugnare studieupplägg.',
    category: 'STUDY',
    color: '#B269FF',
    isPopular: true,
    details: [
      { label: 'Kategori', value: 'Plugg', visibility: 'SUMMARY' },
      { label: 'Upplägg', value: 'utvecklingssteg', visibility: 'SUMMARY' },
      { label: 'Fokus', value: 'Studieplan, veckomål och examination', visibility: 'DETAIL' },
      { label: 'Passar dig som', value: 'vill ta kontroll över en pågående kurs', visibility: 'DETAIL' },
    ],
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
    summaryDescription: 'Planera dina studier så att du klarar alla moment innan examen.',
    detailDescription:
      'Målet ger dig en struktur för att prioritera kurser, planera terminen och minska risken att halka efter innan examen.',
    category: 'STUDY',
    color: '#B269FF',
    isPopular: false,
    details: [
      { label: 'Kategori', value: 'Plugg', visibility: 'SUMMARY' },
      { label: 'Upplägg', value: 'utvecklingssteg', visibility: 'SUMMARY' },
      { label: 'Tidsfokus', value: 'Terminsplanering', visibility: 'SUMMARY' },
      { label: 'Fokus', value: 'Kurser, deadlines och veckovis uppföljning', visibility: 'DETAIL' },
      { label: 'Passar dig som', value: 'vill få struktur över hela studieperioden', visibility: 'DETAIL' },
    ],
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
    summaryDescription: 'Ta dig steg för steg fram till körkortet.',
    detailDescription:
      'Det här målet låter dig strukturera körkortsresan från teori till uppkörning i tydliga etapper.',
    category: 'STUDY',
    color: '#B269FF',
    isPopular: false,
    details: [
      { label: 'Kategori', value: 'Plugg', visibility: 'SUMMARY' },
      { label: 'Upplägg', value: 'utvecklingssteg', visibility: 'SUMMARY' },
      { label: 'Måltyp', value: 'Körkort', visibility: 'SUMMARY' },
      { label: 'Fokus', value: 'Teori, körlektioner och prov', visibility: 'DETAIL' },
      { label: 'Passar dig som', value: 'vill göra körkortet mer strukturerat', visibility: 'DETAIL' },
    ],
    milestones: [
      { title: 'del 1' },
    ],
  },
];
