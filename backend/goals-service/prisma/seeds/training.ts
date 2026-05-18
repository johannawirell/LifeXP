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
    difficulty: 'MEDIUM',
    goalXpReward: 500,
    totalXpReward: 1200,
    color: '#73D86A',
    isPopular: true,
    details: [
      { label: 'Kategori', value: 'Träning', visibility: 'SUMMARY' },
      { label: 'Upplägg', value: 'utvecklingssteg', visibility: 'SUMMARY' },
      { label: 'Målnivå', value: '5 km löpning', visibility: 'SUMMARY' },
      { label: 'Fokus', value: 'Kondition och uthållighet', visibility: 'DETAIL' },
    ],
    milestones: [
      {
        title: 'Startmål',
        description: 'Kom igång lugnt och vänj kroppen vid rörelse.',
        xpReward: 100,
        subtasks: [
          'Gå 20 minuter utan paus',
          'Jogga 1 minut och gå 2 minuter, upprepa 8 gånger',
          'Genomför 2 lugna pass samma vecka',
        ],
        tips: [
          'Spring så långsamt att du kan prata samtidigt.',
          'Det viktigaste är att skapa vanan, inte att springa snabbt.',
        ],
      },
      {
        title: 'Grunduthållighet',
        description: 'Bygg upp konditionen så att du orkar springa längre utan att stanna.',
        xpReward: 200,
        subtasks: [
          'Spring 1 km utan paus',
          'Spring 10 minuter sammanhängande',
          'Genomför 3 träningspass under en vecka',
        ],
        tips: [
          'Varva gång och jogg om det behövs.',
          'Vila minst en dag mellan löppassen i början.',
        ],
      },
      {
        title: 'Bygg mot 5 km',
        description: 'Öka distansen stegvis och hitta ett tempo som känns hållbart.',
        xpReward: 400,
        subtasks: [
          'Spring 2 km utan paus',
          'Spring 3 km utan paus',
          'Spring 20 minuter sammanhängande',
          'Spring totalt 4 km under ett pass',
        ],
        tips: [
          'Öka hellre lite i taget än för mycket på en gång.',
          'Fokusera på att fullfölja passet, inte på hastigheten.',
        ],
      },
      {
        title: 'Nära målet',
        description: 'Ta dig från nästan där till att klara hela fem kilometer.',
        xpReward: 500,
        subtasks: [
          'Spring 4 km utan paus',
          'Spring 30 minuter sammanhängande',
          'Testa 5 km i lugnt tempo',
          'Spring 5 km utan att stanna',
        ],
        tips: [
          'Planera rutten i förväg så att du vet ungefär hur långt du ska springa.',
          'Börja långsammare än du tror att du behöver.',
        ],
      },
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
  },
  {
    title: 'Springa halvmaraton',
    icon: 'walk-outline',
    subtitle: 'Träning',
    summaryDescription: 'Träna stegvis för att kunna genomföra ett halvmaraton.',
    detailDescription:
      'Målet guidar dig genom ett längre löparupplägg där du successivt ökar volym, långpass och återhämtning inför loppet.',
    category: 'TRAINING',
    difficulty: 'EPIC',
    goalXpReward: 300,
    totalXpReward: 1200,
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
      { title: 'Skapa ett 12-veckors träningsupplägg', xpReward: 100 },
      { title: 'Bygg upp veckovolymen gradvis', xpReward: 150 },
      { title: 'Lägg in ett långpass varje vecka', xpReward: 175 },
      { title: 'Träna tempo och återhämtning', xpReward: 175 },
      { title: 'Genomför loppet', xpReward: 300 },
    ],
  },
];
