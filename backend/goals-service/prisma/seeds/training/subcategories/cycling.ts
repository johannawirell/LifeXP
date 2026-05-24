import { CATEGORY_COLORS, type GoalTemplateSeed } from '../../template-seed-types';
import { cyclingSharedQuests } from './training-types';

export const cyclingGoals: GoalTemplateSeed[] = [
  // EASY
  {
    title: 'Börja cykla regelbundet',
    icon: 'bicycle-outline',
    subtitle: ['cycling'],
    summaryDescription: 'Skapa en hållbar vana och vänj kroppen vid regelbunden cykling.',
    category: 'TRAINING',
    difficulty: 'EASY',
    focusLabel: 'Rutiner',
    totalXpReward: 800,
    color: CATEGORY_COLORS.training,
    isPopular: true,
    milestones: [
      {
        title: 'Kom igång',
        description: 'Börja vänja kroppen vid kortare cykelpass.',
        xpReward: 150,
        subtasks: [
          'Pass 1: Cykla 15 minuter',
          'Pass 2: Cykla 20 minuter',
          'Pass 3: Cykla 25 minuter',
        ],
        tips: [
          'Tempot spelar ingen roll i början.',
          'Fokusera på att skapa rutin.'
        ],
      },
      {
        title: 'Bygg kondition',
        description: 'Nu börjar kroppen vänja sig vid längre tid på cykeln.',
        xpReward: 200,
        subtasks: [
          'Pass 1: Cykla 30 minuter',
          'Pass 2: Cykla 5 km',
          'Pass 3: Cykla 35 minuter',
        ],
        tips: [
          'Försök hålla jämnt tempo.',
          'Ta det lugnt i uppförsbackar.'
        ],
      },
      {
        title: 'Cykla regelbundet',
        description: 'Nu bygger du en stabil träningsvana.',
        xpReward: 200,
        subtasks: [
          'Pass 1: Cykla 2 gånger samma vecka',
          'Pass 2: Cykla totalt 15 km på en vecka',
          'Pass 3: Cykla 40 minuter',
        ],
        tips: [
          'Konsekvens är viktigare än fart.',
          'Planera in passen i förväg.'
        ],
      },
      {
        title: 'Skapa en hållbar rutin',
        description: 'Nu börjar cyklingen bli en naturlig del av vardagen.',
        xpReward: 250,
        subtasks: [
          'Pass 1: Cykla 45 minuter',
          'Pass 2: Cykla 20 km totalt på en vecka',
          'Pass 3: Cykla 3 gånger samma vecka',
        ],
        tips: [
          'Små pass räknas också.',
          'Bygg vanan steg för steg.'
        ],
      },
    ],
    quests: cyclingSharedQuests,
  },

  // MEDIUM
  {
    title: 'Cykla 50 km',
    icon: 'bicycle-outline',
    subtitle: ['cycling'],
    summaryDescription: 'Bygg uthållighet och klara att cykla 50 km.',
    category: 'TRAINING',
    difficulty: 'MEDIUM',
    focusLabel: 'Uthållighet',
    totalXpReward: 2500,
    color: CATEGORY_COLORS.training,
    isPopular: true,
    milestones: [
      {
        title: 'Bygg längre distanser',
        description: 'Vänj kroppen vid längre cykelpass.',
        xpReward: 500,
        subtasks: [
          'Pass 1: Cykla 15 km',
          'Pass 2: Cykla 20 km',
          'Pass 3: Cykla 25 km',
        ],
        tips: [
          'Håll ett tempo som känns hållbart.',
          'Drick vatten regelbundet.'
        ],
      },
      {
        title: 'Öka uthålligheten',
        description: 'Nu börjar längre rundor kännas mer naturliga.',
        xpReward: 700,
        subtasks: [
          'Pass 1: Cykla 30 km',
          'Pass 2: Cykla 35 km',
          'Pass 3: Cykla två längre pass samma vecka',
        ],
        tips: [
          'Ät något inför längre rundor.',
          'Undvik att starta för hårt.'
        ],
      },
      {
        title: 'Klara 50 km',
        description: 'Nu är målet att genomföra en längre cykelrunda.',
        xpReward: 1300,
        subtasks: [
          'Pass 1: Cykla 40 km',
          'Pass 2: Förbered energi och vätska',
          'Pass 3: Cykla 50 km',
        ],
        tips: [
          'Dela upp rundan mentalt.',
          'Jämnt tempo sparar energi.'
        ],
      },
    ],
    quests: cyclingSharedQuests,
  },

  // HARD
  {
    title: 'Cykla 100 km',
    icon: 'bicycle-outline',
    subtitle: ['cycling'],
    summaryDescription: 'Bygg långdistansuthållighet och klara att cykla 100 km.',
    category: 'TRAINING',
    difficulty: 'HARD',
    focusLabel: 'Långdistans',
    totalXpReward: 5000,
    color: CATEGORY_COLORS.training,
    isPopular: false,
    milestones: [
      {
        title: 'Bygg långdistansgrund',
        description: 'Nu börjar kroppen vänja sig vid flera timmar på cykeln.',
        xpReward: 1000,
        subtasks: [
          'Pass 1: Cykla 50 km',
          'Pass 2: Cykla 60 km',
          'Pass 3: Cykla två längre pass samma vecka',
        ],
        tips: [
          'Fyll på energi regelbundet.',
          'Sittställning blir viktigare på längre pass.'
        ],
      },
      {
        title: 'Bygg uthållighet över tid',
        description: 'Nu handlar det om att hålla jämn energi under långa rundor.',
        xpReward: 1500,
        subtasks: [
          'Pass 1: Cykla 70 km',
          'Pass 2: Cykla 80 km',
          'Pass 3: Testa energi under längre pass',
        ],
        tips: [
          'Drick innan du blir törstig.',
          'Jämn intensitet sparar mycket energi.'
        ],
      },
      {
        title: 'Klara 100 km',
        description: 'Nu är målet att cykla en hel långdistansrunda.',
        xpReward: 2500,
        subtasks: [
          'Pass 1: Cykla 90 km',
          'Pass 2: Planera energi och återhämtning',
          'Pass 3: Cykla 100 km',
        ],
        tips: [
          'Tempot ska kännas hållbart hela vägen.',
          'Mental uthållighet är lika viktigt som fysisk.'
        ],
      },
    ],
    quests: cyclingSharedQuests,
  },

  // EPIC
  {
    title: 'Cykla Vätternrundan',
    icon: 'bicycle-outline',
    subtitle: ['cycling'],
    summaryDescription: 'Träna långsiktigt för att klara en av Sveriges mest ikoniska cykelutmaningar.',
    category: 'TRAINING',
    difficulty: 'EPIC',
    focusLabel: 'Extrem uthållighet',
    totalXpReward: 10000,
    color: CATEGORY_COLORS.training,
    isPopular: false,
    milestones: [
      {
        title: 'Bygg extrem uthållighet',
        description: 'Nu vänjer sig kroppen vid riktigt långa rundor.',
        xpReward: 2000,
        subtasks: [
          'Pass 1: Cykla 100 km',
          'Pass 2: Cykla 120 km',
          'Pass 3: Cykla två längre rundor samma vecka',
        ],
        tips: [
          'Återhämtning blir viktigare ju längre du cyklar.',
          'Fyll på energi ofta.'
        ],
      },
      {
        title: 'Förbered kroppen för heldagsrundor',
        description: 'Nu handlar det om uthållighet över många timmar.',
        xpReward: 3000,
        subtasks: [
          'Pass 1: Cykla 150 km',
          'Pass 2: Testa energiupplägg under pass',
          'Pass 3: Cykla 200 km',
        ],
        tips: [
          'Undvik att öppna för hårt.',
          'Jämn pacing är avgörande.'
        ],
      },
      {
        title: 'Klara Vätternrundan',
        description: 'Nu är målet att genomföra hela Vätternrundan.',
        xpReward: 5000,
        subtasks: [
          'Pass 1: Förbered utrustning och energi',
          'Pass 2: Vila och återhämta dig ordentligt',
          'Pass 3: Genomför Vätternrundan',
        ],
        tips: [
          'Det handlar om uthållighet, inte fart.',
          'Bryt ner loppet i mindre delar mentalt.'
        ],
      },
    ],
    quests: cyclingSharedQuests,
  },
];