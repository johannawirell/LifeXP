// strength.ts

import { CATEGORY_COLORS, type GoalTemplateSeed } from '../../template-seed-types';
import { strengthSharedQuests } from './training-types';

export const strengthGoals: GoalTemplateSeed[] = [
    // EASY
  {
    title: 'Börja gymma regelbundet',
    icon: 'barbell-outline',
    subtitle: ['strength'],
    summaryDescription: 'Träna regelbundet och bygg styrka över tid.',
    category: 'TRAINING',
    difficulty: 'EASY',
    focusLabel: 'Muskelmassa och styrka',
    totalXpReward: 700,
    color: CATEGORY_COLORS.training,
    isPopular: true,
    milestones: [
      {
        title: 'Skapa träningsrutin',
        description: 'Sätt upp en enkel plan för styrketräningen.',
        xpReward: 100,
        subtasks: [
          'Välj 3 träningsdagar per vecka',
          'Bestäm vilka muskelgrupper du ska träna',
          'Skriv ner startvikter eller övningar',
        ],
        tips: ['Börja enkelt.', 'Det viktigaste är att komma igång.'],
      },
      {
        title: 'Bygg grundstyrka',
        description: 'Lär kroppen basövningar och skapa stabilitet.',
        xpReward: 150,
        subtasks: [
          'Gör 3 helkroppspass',
          'Träna ben, rygg, bröst och core',
          'Fokusera på teknik före vikt',
        ],
        tips: ['Filma gärna tekniken.', 'Öka inte vikten för snabbt.'],
      },
      {
        title: 'Progressiv överbelastning',
        description: 'Öka belastningen stegvis över tid.',
        xpReward: 200,
        subtasks: [
          'Öka vikt eller repetitioner i minst 3 övningar',
          'Logga dina pass',
          'Träna minst 3 veckor i rad',
        ],
        tips: ['Små ökningar räcker.', 'Skriv ner allt du gör.'],
      },
      {
        title: 'Följ upp resultat',
        description: 'Mät utvecklingen och justera planen.',
        xpReward: 250,
        subtasks: [
          'Jämför styrka från första veckan',
          'Ta kroppsmått eller progressbilder',
          'Sätt nästa styrkemål',
        ],
        tips: ['Jämför med dig själv.', 'Progression kan vara både styrka och vana.'],
      },
    ],
    quests: strengthSharedQuests,
  },
  {
    title: 'Våga gå till gymmet själv',
    icon: 'fitness-outline',
    subtitle: ['strength','health'],
    summaryDescription: 'Bygg självförtroende och gör gymmet till din plats.',
    category: 'TRAINING',
    difficulty: 'EASY',
    focusLabel: 'Gymvana och självförtroende',
    totalXpReward: 420,
    color: CATEGORY_COLORS.training,
    isPopular: true,
    milestones: [
      {
        title: 'Utforska gymmet',
        description: 'Bekanta dig med miljön och utrustningen.',
        xpReward: 80,
        subtasks: [
          'Gå till gymmet och titta runt',
          'Testa 3 olika maskiner eller fria vikter',
          'Prata med personalen om du har frågor',
        ],
        tips: ['Det är okej att känna sig osäker i början.', 'Alla har varit där.'],
      },
      {
        title: 'Gör ditt första pass',
        description: 'Genomför ett enkelt träningspass på egen hand.',
        xpReward: 100,
        subtasks: [
          'Välj 3-4 övningar du vill prova',
          'Gör 2 set av varje övning',
          'Fokusera på att ha roligt och känna dig stark',
        ],
        tips: ['Det är mer än okej att göra ett kort pass.', 'Fokusera på upplevelsen, inte prestationen.'],
      },
      {
        title: 'Skapa en rutin',
        description: 'Gör gymbesöken till en vana.',
        xpReward: 120,
        subtasks: [
          'Planera in 2-3 gymbesök nästa vecka',
          'Förbered kläder och utrustning i förväg',
          'Belöna dig själv efter varje besök',
        ],
        tips: ['Små steg skapar vanor.', 'Belöna dig själv för att du tar dig dit.'],
      },
      {
        title: 'Känn dig trygg',
        description: 'Bygg självförtroende och gör gymmet till din plats.',
        xpReward: 120,
        subtasks: [
          'Gör ett pass utan att känna dig osäker',
          'Prata med någon ny på gymmet',
          'Fokusera på din egen utveckling, inte andra',
        ],
        tips: ['Gymmet är en plats för alla.', 'Fokusera på din egen resa.'],
      },
    ],
    quests: strengthSharedQuests,
  },
  {
    title: 'Klara 10 armhävningar',
    icon: 'body-outline',
    subtitle: ['strength'],
    summaryDescription: 'Bygg överkroppsstyrka och klara 10 armhävningar.',
    category: 'TRAINING',
    difficulty: 'EASY',
    focusLabel: 'Överkropp och core',
    totalXpReward: 420,
    color: CATEGORY_COLORS.training,
    isPopular: true,
    milestones: [
      {
        title: 'Bygg startstyrka',
        xpReward: 80,
        subtasks: [
          'Gör 3 set armhävningar mot vägg',
          'Gör 3 set armhävningar mot bord',
          'Träna core 5 minuter',
        ],
      },
      {
        title: 'Knäarmhävningar',
        xpReward: 100,
        subtasks: [
          'Gör 3 set med bra teknik',
        ],
      },
      {
        title: 'Första riktiga armhävningen',
        xpReward: 120,
        subtasks: [
          'Gör 1 armhävning med full kontroll',
          'Träna långsam sänkning',
          'Håll kroppen rak',
        ],
      },
      {
        title: 'Klara 10 armhävningar',
        xpReward: 120,
        subtasks: [
          'Gör 5 armhävningar',
          'Gör 8 armhävningar',
          'Gör 10 armhävningar utan paus',
        ],
      },
    ],
    quests: strengthSharedQuests,
  },
  // MEDIUM
  // HARD
  // EPIC
  // LEGENDARY
];
