import { CATEGORY_COLORS, type GoalTemplateSeed } from '../../template-seed-types';
import { walkingSharedQuests } from './training-types';

export const walkingGoals: GoalTemplateSeed[] = [
  // EASY
  {
    title: 'Börja gå promenader',
    icon: 'walk-outline',
    subtitle: ['walking'],
    summaryDescription: 'Skapa en enkel och hållbar vana genom dagliga promenader.',
    category: 'TRAINING',
    difficulty: 'EASY',
    focusLabel: 'Vardagsrörelse',
    totalXpReward: 600,
    color: CATEGORY_COLORS.training,
    isPopular: true,
    milestones: [
      {
        title: 'Kom igång',
        description: 'Börja vänja kroppen vid daglig rörelse.',
        xpReward: 100,
        subtasks: [
          'Promenera 10 minuter',
          'Promenera 15 minuter',
          'Promenera 20 minuter',
        ],
        tips: [
          'Tempot spelar ingen roll.',
          'Det viktigaste är att du kommer ut.'
        ],
      },
      {
        title: 'Skapa rutin',
        description: 'Nu börjar promenader bli en del av vardagen.',
        xpReward: 150,
        subtasks: [
          'Promenera 3 dagar samma vecka',
          'Promenera totalt 60 minuter på en vecka',
          'Ta en promenad trots låg motivation',
        ],
        tips: [
          'Små promenader räknas också.',
          'Rutiner byggs genom repetition.'
        ],
      },
      {
        title: 'Bygg vardagsmotion',
        description: 'Öka tiden du rör dig varje vecka.',
        xpReward: 150,
        subtasks: [
          'Promenera 30 minuter',
          'Promenera 4 dagar samma vecka',
          'Promenera totalt 10 000 steg på en dag',
        ],
        tips: [
          'Promenader hjälper både kropp och huvud.',
          'Fokusera på kontinuitet.'
        ],
      },
      {
        title: 'Skapa en hållbar vana',
        description: 'Nu har promenader blivit en naturlig del av vardagen.',
        xpReward: 200,
        subtasks: [
          'Promenera 5 dagar samma vecka',
          'Promenera totalt 15 000 steg på en dag',
          'Promenera 45 minuter utan paus',
        ],
        tips: [
          'All rörelse räknas.',
          'Du bygger långsiktig hälsa.'
        ],
      },
    ],
    quests: walkingSharedQuests,
  },

  // MEDIUM
  {
    title: 'Gå 10 000 steg om dagen',
    icon: 'walk-outline',
    subtitle: ['walking'],
    summaryDescription: 'Bygg en stabil vardagsrutin genom att nå 10 000 steg om dagen.',
    category: 'TRAINING',
    difficulty: 'MEDIUM',
    focusLabel: 'Aktiv vardag',
    totalXpReward: 2000,
    color: CATEGORY_COLORS.training,
    isPopular: true,
    milestones: [
      {
        title: 'Öka vardagsrörelsen',
        description: 'Börja öka antalet steg varje dag.',
        xpReward: 400,
        subtasks: [
          'Nå 5 000 steg på en dag',
          'Nå 6 000 steg på en dag',
          'Nå 7 000 steg på en dag',
        ],
        tips: [
          'Ta korta promenader under dagen.',
          'Alla steg räknas.'
        ],
      },
      {
        title: 'Bygg stabil rutin',
        description: 'Nu börjar kroppen vänja sig vid mer rörelse.',
        xpReward: 600,
        subtasks: [
          'Nå 8 000 steg på en dag',
          'Nå 9 000 steg på en dag',
          'Promenera 5 dagar samma vecka',
        ],
        tips: [
          'Försök röra dig lite varje dag.',
          'Vardagsmotion gör stor skillnad.'
        ],
      },
      {
        title: 'Klara 10 000 steg',
        description: 'Nu är målet att nå 10 000 steg på en dag.',
        xpReward: 1000,
        subtasks: [
          'Nå 10 000 steg en gång',
          'Nå 10 000 steg två dagar samma vecka',
          'Nå 10 000 steg tre dagar samma vecka',
        ],
        tips: [
          'Promenader är underskattad träning.',
          'Fokusera på konsekvens.'
        ],
      },
    ],
    quests: walkingSharedQuests,
  },

  // HARD
  {
    title: 'Vandra 20 km',
    icon: 'walk-outline',
    subtitle: ['walking'],
    summaryDescription: 'Bygg uthållighet och klara en längre vandring.',
    category: 'TRAINING',
    difficulty: 'HARD',
    focusLabel: 'Uthållighet',
    totalXpReward: 5000,
    color: CATEGORY_COLORS.training,
    isPopular: false,
    milestones: [
      {
        title: 'Bygg längre promenader',
        description: 'Nu börjar du vänja kroppen vid längre tid i rörelse.',
        xpReward: 1000,
        subtasks: [
          'Promenera 5 km',
          'Promenera 7 km',
          'Promenera 10 km',
        ],
        tips: [
          'Använd bekväma skor.',
          'Drick vatten under längre rundor.'
        ],
      },
      {
        title: 'Bygg uthållighet',
        description: 'Nu börjar längre sträckor kännas mer naturliga.',
        xpReward: 1500,
        subtasks: [
          'Promenera 12 km',
          'Promenera 15 km',
          'Promenera i kuperad terräng',
        ],
        tips: [
          'Håll jämnt tempo.',
          'Ta korta pauser vid behov.'
        ],
      },
      {
        title: 'Klara 20 km',
        description: 'Nu är målet att genomföra en lång vandring.',
        xpReward: 2500,
        subtasks: [
          'Promenera 18 km',
          'Förbered energi och vatten',
          'Promenera 20 km',
        ],
        tips: [
          'Dela upp sträckan mentalt.',
          'Uthållighet byggs steg för steg.'
        ],
      },
    ],
    quests: walkingSharedQuests,
  },

  // EPIC
  {
    title: 'Vandra i fjällen',
    icon: 'walk-outline',
    subtitle: ['walking'],
    summaryDescription: 'Förbered kropp och psyke för längre vandringar i natur och fjällmiljö.',
    category: 'TRAINING',
    difficulty: 'EPIC',
    focusLabel: 'Äventyr och uthållighet',
    totalXpReward: 8000,
    color: CATEGORY_COLORS.training,
    isPopular: false,
    milestones: [
      {
        title: 'Bygg vandringsuthållighet',
        description: 'Vänj kroppen vid längre promenader och ojämnt underlag.',
        xpReward: 1500,
        subtasks: [
          'Promenera 10 km',
          'Promenera i skog eller terräng',
          'Promenera med ryggsäck',
        ],
        tips: [
          'Terräng kräver mer energi.',
          'Bra skor gör stor skillnad.'
        ],
      },
      {
        title: 'Förbered kroppen för heldagar',
        description: 'Nu börjar du vänja dig vid längre tid ute i naturen.',
        xpReward: 2500,
        subtasks: [
          'Promenera 15 km',
          'Vandra i kuperad terräng',
          'Genomför en heldag utomhus',
        ],
        tips: [
          'Ät och drick regelbundet.',
          'Anpassa tempot efter terrängen.'
        ],
      },
      {
        title: 'Klara fjällvandring',
        description: 'Nu är målet att genomföra en längre vandring i naturen.',
        xpReward: 4000,
        subtasks: [
          'Planera utrustning och packning',
          'Vandra en längre dagsrunda',
          'Genomför en fjällvandring',
        ],
        tips: [
          'Det handlar om upplevelsen, inte fart.',
          'Naturen bygger både fysisk och mental styrka.'
        ],
      },
    ],
    quests: walkingSharedQuests,
  },
];