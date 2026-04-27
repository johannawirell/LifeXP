import type { GoalTemplateSeed } from './template-seed-types';

export const trainingGoalTemplates: GoalTemplateSeed[] = [
  {
    title: 'Springa 5 km',
    icon: 'walk-outline',
    subtitle: 'Träning',
    summaryDescription: 'Bygg upp din kondition och spring 5 km utan att stanna.',
    detailDescription:
      'Det här målet hjälper dig att bygga upp uthållighet steg för steg tills du klarar att springa fem kilometer sammanhängande.',
    category: 'TRAINING',
    color: '#73D86A',
    isPopular: true,
    details: [
      { label: 'Kategori', value: 'Träning', visibility: 'SUMMARY' },
      { label: 'Upplägg', value: 'utvecklingssteg', visibility: 'SUMMARY' },
      { label: 'Målnivå', value: '5 km löpning', visibility: 'SUMMARY' },
      { label: 'Fokus', value: 'Kondition och uthållighet', visibility: 'DETAIL' },
      { label: 'Passar dig som', value: 'vill komma igång med löpning eller nå en tydlig distans', visibility: 'DETAIL' },
    ],
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
    summaryDescription: 'Träna regelbundet och bygg styrka över tid.',
    detailDescription:
      'Målet fokuserar på att skapa kontinuitet i styrketräningen, sätta kostramar och följa din utveckling över tid.',
    category: 'TRAINING',
    color: '#F5C13C',
    isPopular: true,
    details: [
      { label: 'Kategori', value: 'Träning', visibility: 'SUMMARY' },
      { label: 'Upplägg', value: 'utvecklingssteg', visibility: 'SUMMARY' },
      { label: 'Fokus', value: 'Progressiv överbelastning och uppföljning', visibility: 'DETAIL' },
      { label: 'Passar dig som', value: 'vill bygga styrka och muskelmassa strukturerat', visibility: 'DETAIL' },
    ],
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
    summaryDescription: 'Träna stegvis för att kunna genomföra ett halvmaraton.',
    detailDescription:
      'Målet guidar dig genom ett längre löparupplägg där du successivt ökar volym, långpass och återhämtning inför loppet.',
    category: 'TRAINING',
    color: '#73D86A',
    isPopular: false,
    details: [
      { label: 'Kategori', value: 'Träning', visibility: 'SUMMARY' },
      { label: 'Upplägg', value: 'utvecklingssteg', visibility: 'SUMMARY' },
      { label: 'Målnivå', value: 'Halvmaraton', visibility: 'SUMMARY' },
      { label: 'Fokus', value: 'Långpass, veckovolym och återhämtning', visibility: 'DETAIL' },
      { label: 'Passar dig som', value: 'redan springer regelbundet och vill ta nästa steg', visibility: 'DETAIL' },
    ],
    milestones: [
      { title: 'Skapa ett 12-veckors träningsupplägg' },
      { title: 'Bygg upp veckovolymen gradvis' },
      { title: 'Lägg in ett långpass varje vecka' },
      { title: 'Träna tempo och återhämtning' },
      { title: 'Genomför loppet' },
    ],
  },
];
