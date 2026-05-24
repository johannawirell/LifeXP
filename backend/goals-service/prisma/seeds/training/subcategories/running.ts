import { CATEGORY_COLORS, type GoalTemplateSeed } from '../../template-seed-types';
import { runningSharedQuests } from './training-types';

export const runningGoals: GoalTemplateSeed[] = [
  // --------- DISTANSER ----------
  // EASY
  {
    title: 'Springa 1 km',
    icon: 'walk-outline',
    subtitle: ['running'],
    summaryDescription: 'Kom igång med löpning och klara din första kilometer utan paus.',
    category: 'TRAINING',
    difficulty: 'EASY',
    focusLabel: 'Kondition',
    totalXpReward: 350,
    color: CATEGORY_COLORS.training,
    isPopular: true,
    milestones: [
      {
        title: 'Vänj kroppen vid rörelse',
        description: 'Väck kroppen och skapa vana där du varvar gång och jogg.',
        xpReward: 50,
        subtasks: [
          'Pass 1: Gå 20 minuter utan paus',
          'Pass 2: Jogga 30 sekunder och gå 2 minuter, upprepa 6 gånger',
          'Pass 3: Gå 90 sekunder, jogga 45 sekunder, upprepa 8 gånger',
        ],
        tips: ['Spring långsamt från början.', 
          'Fokusera på vana före prestation.', 
          'Börja gärna på plant och mjukt underlag.'
        ],
      },
      {
        title: 'Bygg konditionen',
        description: 'Öka tiden du joggar och vänj kroppen vid längre intervaller.',
        xpReward: 50,
        subtasks: [
          'Pass 1: Jogga 1 minut och gå 2 minuter, upprepa 8 gånger',
          'Pass 2: Jogga 45 sekunder och gå 90 sekunder, upprepa 10 gånger',
          'Pass 3: Jogga 90 sekunder och gå 90 sekunder, upprepa 8 gånger',
        ],
        tips: ['Målet är kontinuitet.', 'Ta det lugnt även om du känner dig stark.'],
      },
      {
        title: 'Bygg första uthålligheten',
        description: 'Nu börjar kroppen vänja sig vid längre löpsträckor. Börja springa längre sammanhängande sträckor.',
        xpReward: 100,
        subtasks: [
          'Pass 1: Jogga 3 minuter och gå 1 minuter, upprepa 5 gånger',
          'Pass 2: Jogga 5 minuter och gå 2 minuter, upprepa 3 gånger',
          'Pass 3: Jogga 700-800 meter i lugnt tempo utan att stanna',
        ],
        tips: ['Välj platt underlag i början.', 'Försök att sakta ner istället för att stanna.'],
      },
      {
        title: 'Klara 1 km',
        description: 'Nästan där! Nu är det dags att ta dig igenom hela kilometern utan att stanna.',
        xpReward: 150,
        subtasks: [
          'Pass 1: Jogga 800 meter i lugnt tempo utan att stanna',
          'Pass 2: Jogga 900 meter i lugnt tempo utan att stanna',
          'Pass 3: Jogga 1 km i lugnt tempo utan att stanna',
        ],
        tips: ['Målet är inte tiden, utan distansen.'],
      },
    ],
    quests: runningSharedQuests,
  },
  // MEDIUM
  {
    title: 'Springa 5 km',
    icon: 'walk-outline',
    subtitle: ['running'],
    summaryDescription: 'Bygg upp din kondition och spring 5 km utan att stanna.',
    category: 'TRAINING',
    difficulty: 'MEDIUM',
    focusLabel: 'Kondition',
    totalXpReward: 1000,
    color: CATEGORY_COLORS.training,
    isPopular: true,
    milestones: [
      {
        title: 'Bygg uthålligheten',
        description: 'Kom igång lugnt och vänj kroppen vid rörelse.',
        xpReward: 100,
        subtasks: [
          'Pass 1: Spring 1 km i lugnt tempo utan att stanna',
          'Pass 2: Spring 1 km och gå i 2 minuter, upprepa 2 gånger',
          'Pass 3: Spring 1,5 km i lugnt tempo utan att stanna',
        ],
        tips: [
          'Spring långsammare än du tror att du behöver.',
          'Målet är att orka längre, inte att springa snabbare.',
        ],
      },
      {
        title: 'Spring längre sträckor',
        description: 'Bygg upp konditionen så att du orkar springa längre utan att stanna.',
        xpReward: 200,
        subtasks: [
          'Pass 1: Spring 2 km utan stopp',
          'Pass 2: Spring 1,5 km, gå 2 minuter och spring 1 km till',
          'Pass 3: Spring 2,5 km i lugnt tempo',
        ],
        tips: [
          'Varva gång och jogg om det behövs.',
          'Var snäll mot kroppen, det är en stor förändring.',
        ],
      },
      {
        title: 'Bygg mot 5 km',
        description: 'Öka distansen stegvis och hitta ett tempo som känns hållbart.',
        xpReward: 300,
        subtasks: [
          'Pass 1: Spring 3 km utan stopp',
          'Pass 2: Spring 2 km, gå 1 minut och spring 1,5 km till',
          'Pass 3: Spring 4 km i lugnt tempo',
        ],
        tips: [
          'Det är normalt att bli trött efter halva passet.',
          'Sakta ner istället för att stanna.'
        ],
      },
      {
        title: 'Klara 5 km',
        description: 'Ta dig från nästan där till att klara hela fem kilometer.',
        xpReward: 400,
        subtasks: [
          'Pass 1: Spring 3 km i bekvämt tempo',
          'Pass 2: Spring 4 km utan stopp',
          'Pass 3: Spring 5 km utan stopp',
        ],
        tips: [
        'Fokusera på rytm och andning.',
        'Tempot spelar ingen roll — att du klarar 5 km är målet.'
        ],
      },
    ],
    quests: runningSharedQuests,
  },
  {
    title: 'Springa 10 km',
    icon: 'walk-outline',
    subtitle: ['running'],
    summaryDescription: 'Bygg vidare från 5 km och klara att springa 10 km i ett hållbart tempo.',
    category: 'TRAINING',
    difficulty: 'HARD',
    focusLabel: 'Distansökning',
    totalXpReward: 2000,
    color: CATEGORY_COLORS.training,
    isPopular: false,
    milestones: [
     { 
      title: 'Bygg längre uthållighet',
      description: 'Nu handlar träningen om att vänja kroppen vid längre distanser.',
      xpReward: 150,
      subtasks: [
        'Pass 1: Spring 5 km i lugnt tempo',
        'Pass 2: Spring 3 km, gå 2 minuter och spring 2 km till',
        'Pass 3: Spring 6 km utan stopp',
      ],
      tips: [
        'Håll ett tempo där du fortfarande kan prata.',
        'Spring hellre långsamt och jämnt än snabbt och ojämnt.'
      ],
      },
      {
        title: 'Öka distansen',
        description: 'Kroppen börjar vänja sig vid längre tid av kontinuerlig löpning.',
        xpReward: 200,
        subtasks: [
          'Pass 1: Spring 6 km utan stopp',
          'Pass 2: Spring 4 km i lugnt tempo',
          'Pass 3: Spring 7 km utan stopp',
        ],
        tips: [
          'Försök hitta ett jämnt tempo tidigt i passet.',
          'Kortare steg hjälper ofta när benen blir trötta.'
        ],
      },
      {
        title: 'Förbered kroppen för 10 km',
        description: 'Nu tränar du på att hålla igång under längre tid utan paus.',
        xpReward: 300,
        subtasks: [
          'Pass 1: Spring 7 km utan stopp',
          'Pass 2: Spring 5 km i återhämtningstempo',
          'Pass 3: Spring 8-9 km i lugnt tempo',
        ],
        tips: [
          'Det är normalt att känna sig tung i mitten av passet.',
          'Fokusera på rytm och avslappnad andning.'
        ],
      },
      {
        title: 'Vecka 4: Klara 10 kilometer',
        description: 'Nu är målet att ta dig hela vägen till 10 km.',
        xpReward: 350,
        subtasks: [
          'Pass 1: Spring 8 km utan stopp',
          'Pass 2: Spring 5 km lugnt och kontrollerat',
          'Pass 3: Spring 10 km utan stopp',
        ],
        tips: [
          'Börja långsammare än du tror behövs.',
          'Att hålla igång hela vägen är viktigare än fart.'
        ],
      },
    ],
    quests: runningSharedQuests,
  },
  // EPIC
  {
    title: 'Springa halvmaraton',
    icon: 'walk-outline',
    subtitle: ['running'],
    summaryDescription: 'Träna stegvis för att kunna genomföra ett halvmaraton.',
    category: 'TRAINING',
    difficulty: 'EPIC',
    focusLabel: 'Långpass',
    totalXpReward: 5000,
    color: CATEGORY_COLORS.training,
    isPopular: false,
    milestones: [
      {
        title: 'Vänj kroppen vid längre långpass',
        description: 'Nu börjar du vänja kroppen vid längre tid av kontinuerlig löpning.',
        xpReward: 500,
        subtasks: [
          'Pass 1: Spring 10 km i lugnt tempo',
          'Pass 2: Spring 6 km återhämtningspass',
          'Pass 3: Spring 12 km utan stopp',
        ],
        tips: [
          'Spring lugnare än vid kortare distanser.',
          'Fokusera på att hålla jämnt tempo.'
        ],
      },
      {
        title: 'Bygg uthållighet över tid',
        description: 'Kroppen vänjer sig nu vid längre tid av kontinuerlig löpning.',
        xpReward: 600,
        subtasks: [
          'Pass 1: Spring 12 km utan stopp',
          'Pass 2: Spring 7 km lugnt tempo',
          'Pass 3: Spring 14 km i jämnt tempo',
        ],
        tips: [
          'Långpassen ska kännas kontrollerade.',
          'Undvik att öppna för hårt i början.'
        ],
      },
      {
        title: 'Spring längre utan paus',
        description: 'Nu utvecklar du förmågan att hålla igång under längre distanser.',
        xpReward: 700,
        subtasks: [
          'Pass 1: Spring 14 km utan stopp',
          'Pass 2: Spring 8 km återhämtningspass',
          'Pass 3: Spring 16 km i lugnt tempo',
        ],
        tips: [
          'Försök hitta ett avslappnat flyt.',
          'Kortare steg hjälper när benen blir trötta.'
        ],
      },
      {
        title: 'Förbered kroppen för halvmaraton',
        description: 'Nu börjar du närma dig halvmaratondistansen på riktigt.',
        xpReward: 900,
        subtasks: [
          'Pass 1: Spring 16 km utan stopp',
          'Pass 2: Spring 10 km lugnt tempo',
          'Pass 3: Spring 18 km i jämnt tempo',
        ],
        tips: [
          'Fokusera på rytm och andning.',
          'Sakta ner istället för att stanna.'
        ],
      },
      {
        title: 'Bygg självförtroende inför målet',
        description: 'Nu vet kroppen hur längre distanser känns och du bygger trygghet inför slutmålet.',
        xpReward: 1100,
        subtasks: [
          'Pass 1: Spring 18 km utan stopp',
          'Pass 2: Spring 8 km lätt återhämtningspass',
          'Pass 3: Spring 20 km i lugnt tempo',
        ],
        tips: [
          'Det är normalt att bli mentalt trött på långpass.',
          'Behåll lugnt tempo genom hela passet.'
        ],
      },
      {
        title: 'Klara ett halvmaraton',
        description: 'Nu är målet att springa hela halvmaratondistansen.',
        xpReward: 1200,
        subtasks: [
          'Pass 1: Spring 10 km lugnt tempo',
          'Pass 2: Spring 5 km lätt återhämtningspass',
          'Pass 3: Spring 21,1 km utan stopp',
        ],
        tips: [
          'Börja långsammare än du tror behövs.',
          'Att ta sig hela vägen är vinsten.'
        ],
      },
    ],
    quests: runningSharedQuests,
  },
  // LEGENDARY
  {
    title: 'Springa maraton',
    icon: 'walk-outline',
    subtitle: ['running'],
    summaryDescription: 'Bygg upp kroppen och rutinerna för att klara ett helt maraton.',
    category: 'TRAINING',
    difficulty: 'LEGENDARY',
    focusLabel: 'Långsiktigt upplägg, återhämtning och långpass',
    totalXpReward: 1800,
    color: CATEGORY_COLORS.training,
    isPopular: false,
    milestones: [
      
    {
      title: 'Vänj kroppen vid ännu längre distanser',
      description: 'Nu tar du steget från halvmaraton mot ännu längre långpass.',
      xpReward: 800,
      subtasks: [
        'Pass 1: Spring 22 km i lugnt tempo',
        'Pass 2: Spring 10 km återhämtningspass',
        'Pass 3: Spring 24 km utan stopp',
      ],
      tips: [
        'Fokusera på jämnt tempo hela vägen.',
        'Långpassen ska kännas stabila, inte maxade.'
      ],
    },
    {
      title: 'Bygg uthållighet över flera timmar',
      description: 'Kroppen vänjer sig nu vid att springa under längre tid.',
      xpReward: 1000,
      subtasks: [
        'Pass 1: Spring 24 km utan stopp',
        'Pass 2: Spring 12 km lugnt tempo',
        'Pass 3: Spring 26 km i jämnt tempo',
      ],
      tips: [
        'Drick vatten innan du blir törstig.',
        'Försök hålla avslappnade axlar och armar.'
      ],
    },
    {
      title: 'Stärk kroppen för maratondistansen',
      description: 'Nu tränar du på att hålla igång även när kroppen börjar bli trött.',
      xpReward: 1200,
      subtasks: [
        'Pass 1: Spring 26 km utan stopp',
        'Pass 2: Spring 14 km återhämtningspass',
        'Pass 3: Spring 28 km i lugnt tempo',
      ],
      tips: [
        'Kortare steg hjälper ofta när benen blir slitna.',
        'Sakta ner istället för att stanna.'
      ],
    },
    {
      title: 'Utveckla mental uthållighet',
      description: 'Maraton handlar lika mycket om pannben som kondition.',
      xpReward: 1400,
      subtasks: [
        'Pass 1: Spring 30 km utan stopp',
        'Pass 2: Spring 12 km lugnt tempo',
        'Pass 3: Spring 32 km i jämnt tempo',
      ],
      tips: [
        'Dela upp passet mentalt i mindre delar.',
        'Fokusera på rytm och andning.'
      ],
    },
    {
      title: 'Förbered kroppen för maraton',
      description: 'Nu är kroppen nära maratonnivå och vänjer sig vid extrem uthållighet.',
      xpReward: 1700,
      subtasks: [
        'Pass 1: Spring 32 km utan stopp',
        'Pass 2: Spring 14 km återhämtningspass',
        'Pass 3: Spring 35 km i lugnt tempo',
      ],
      tips: [
        'Långpassen ska fortfarande hållas lugna.',
        'Fyll på energi inför och efter passen.'
      ],
    },
    {
      title: 'Bygg trygghet inför slutmålet',
      description: 'Nu handlar träningen om att känna sig trygg inför hela distansen.',
      xpReward: 1800,
      subtasks: [
        'Pass 1: Spring 35 km utan stopp',
        'Pass 2: Spring 10 km lätt återhämtning',
        'Pass 3: Spring 38 km i jämnt tempo',
      ],
      tips: [
        'Det är normalt att känna sig tung i slutet av långpass.',
        'Behåll lugnt tempo även när du känner dig stark.'
      ],
    },
    {
      title: 'Klara ett maraton',
      description: 'Nu är målet att springa hela maratondistansen.',
      xpReward: 2100,
      subtasks: [
        'Pass 1: Spring 16 km lugnt tempo',
        'Pass 2: Spring 8 km lätt återhämtningspass',
        'Pass 3: Spring 42,2 km utan stopp',
      ],
      tips: [
        'Börja långsammare än du tror behövs.',
        'Att ta sig hela vägen är den största vinsten.'
      ],
    },
    ],
    quests: runningSharedQuests,
  },

  // --------- TIDSMÅL ----------
{
  title: 'Spring 5 km under 30 minuter',
  icon: 'timer-outline',
  subtitle: ['running'],
  summaryDescription: 'Förbättra ditt tempo och spring 5 km på under 30 minuter.',
  category: 'TRAINING',
  difficulty: 'HARD',
  focusLabel: 'Tempo',
  totalXpReward: 1500,
  color: CATEGORY_COLORS.training,
  isPopular: false,
  milestones: [
    {
      title: 'Hitta ditt grundtempo',
      description: 'Börja vänja kroppen vid att springa snabbare men kontrollerat.',
      xpReward: 300,
      subtasks: [
        'Pass 1: Spring 5 km i bekvämt tempo och notera tiden',
        'Pass 2: Spring 3 km i något högre tempo',
        'Pass 3: Spring 5 km och försök hålla jämnt tempo',
      ],
      tips: ['Målet är kontroll, inte maxfart.', 'Håll jämn fart från start.'],
    },
    {
      title: 'Bygg fartuthållighet',
      description: 'Träna på att hålla ett snabbare tempo under längre tid.',
      xpReward: 500,
      subtasks: [
        'Pass 1: Spring 4 km i högre tempo',
        'Pass 2: Spring 6 intervaller à 2 minuter snabbt med 1 minut vila',
        'Pass 3: Spring 5 km och försök förbättra din tid',
      ],
      tips: ['Pressa inte max varje pass.', 'Vila ordentligt mellan hårdare pass.'],
    },
    {
      title: 'Klara 5 km under 30 minuter',
      description: 'Nu är målet att springa fem kilometer på under trettio minuter.',
      xpReward: 700,
      subtasks: [
        'Pass 1: Spring 3 km i måltempo',
        'Pass 2: Spring 5 km i lugnt tempo',
        'Pass 3: Spring 5 km under 30 minuter',
      ],
      tips: ['Börja inte för snabbt.', 'Sikta på jämn fart hela vägen.'],
    },
  ],
  quests: runningSharedQuests,
},
{
  title: 'Spring 10 km under 60 minuter',
  icon: 'timer-outline',
  subtitle: ['running'],
  summaryDescription: 'Bygg tempo och uthållighet för att springa 10 km under en timme.',
  category: 'TRAINING',
  difficulty: 'EPIC',
  focusLabel: 'Tempo och uthållighet',
  totalXpReward: 3000,
  color: CATEGORY_COLORS.training,
  isPopular: false,
  milestones: [
    {
      title: 'Bygg stabilt 10 km-tempo',
      description: 'Träna på att hålla ett jämnt och kontrollerat tempo.',
      xpReward: 700,
      subtasks: [
        'Pass 1: Spring 10 km och notera tiden',
        'Pass 2: Spring 5 km i något snabbare tempo',
        'Pass 3: Spring 8 km i jämnt tempo',
      ],
      tips: ['Hitta ett tempo du kan hålla länge.', 'Undvik att rusa första kilometern.'],
    },
    {
      title: 'Öka fartuthålligheten',
      description: 'Kombinera längre pass med snabbare delar.',
      xpReward: 1000,
      subtasks: [
        'Pass 1: Spring 6 km i måltempo',
        'Pass 2: Spring 5 intervaller à 1 km med lugn vila mellan',
        'Pass 3: Spring 10 km och försök närma dig 60 minuter',
      ],
      tips: ['Intervaller bygger fart.', 'Lugna pass bygger uthållighet.'],
    },
    {
      title: 'Klara 10 km under 60 minuter',
      description: 'Nu är målet att springa milen på under en timme.',
      xpReward: 1300,
      subtasks: [
        'Pass 1: Spring 5 km lugnt',
        'Pass 2: Spring 3 km i måltempo',
        'Pass 3: Spring 10 km under 60 minuter',
      ],
      tips: ['Börja kontrollerat.', 'Sista 2 km kan du öka om du orkar.'],
    },
  ],
  quests: runningSharedQuests,
},
{
  title: 'Spring 3 gånger i veckan',
  icon: 'calendar-outline',
  subtitle: ['running'],
  summaryDescription: 'Skapa en hållbar löparrutin med tre pass varje vecka.',
  category: 'TRAINING',
  difficulty: 'EASY',
  focusLabel: 'Rutin',
  totalXpReward: 800,
  color: CATEGORY_COLORS.training,
  isPopular: true,
  milestones: [
    {
      title: 'Skapa första rutinen',
      description: 'Kom igång med tre enkla löppass under en vecka.',
      xpReward: 250,
      subtasks: [
        'Pass 1: Spring eller jogga 15 minuter',
        'Pass 2: Spring eller jogga 20 minuter',
        'Pass 3: Spring eller jogga 15 minuter',
      ],
      tips: ['Håll passen enkla.', 'Målet är att dyka upp, inte prestera.'],
    },
    {
      title: 'Håll rutinen',
      description: 'Upprepa tre pass till och gör löpningen mer naturlig i veckan.',
      xpReward: 250,
      subtasks: [
        'Pass 1: Spring 20 minuter',
        'Pass 2: Spring 15 minuter lugnt',
        'Pass 3: Spring 25 minuter',
      ],
      tips: ['Planera passen i förväg.', 'Vila minst en dag mellan passen om du behöver.'],
    },
    {
      title: 'Gör löpningen till en vana',
      description: 'Fullfölj tre löppass ännu en vecka och stärk vanan.',
      xpReward: 300,
      subtasks: [
        'Pass 1: Spring 20 minuter',
        'Pass 2: Spring 20 minuter',
        'Pass 3: Spring 30 minuter lugnt',
      ],
      tips: ['Konsekvens är viktigare än fart.', 'Belöna dig själv efter veckan.'],
    },
  ],
  quests: runningSharedQuests,
},
{
  title: 'Spring med hund',
  icon: 'paw-outline',
  subtitle: ['running', 'health'],
  summaryDescription: 'Bygg en trygg och rolig löprutin tillsammans med hund.',
  category: 'TRAINING',
  difficulty: 'MEDIUM',
  focusLabel: 'Löpning med hund',
  totalXpReward: 1200,
  color: CATEGORY_COLORS.training,
  isPopular: true,
  milestones: [
    {
      title: 'Vänj hunden vid löpning',
      description: 'Börja lugnt och låt hunden vänja sig vid tempot.',
      xpReward: 300,
      subtasks: [
        'Pass 1: Gå 20 minuter med korta jogginslag',
        'Pass 2: Jogga 1 minut och gå 2 minuter, upprepa 6 gånger',
        'Pass 3: Jogga lugnt 10 minuter med pauser vid behov',
      ],
      tips: ['Anpassa alltid tempot efter hunden.', 'Undvik varmt väder.'],
    },
    {
      title: 'Bygg gemensam rutin',
      description: 'Öka tiden ni joggar tillsammans på ett kontrollerat sätt.',
      xpReward: 400,
      subtasks: [
        'Pass 1: Jogga 15 minuter lugnt',
        'Pass 2: Jogga 20 minuter med korta pauser',
        'Pass 3: Jogga 2 km i lugnt tempo',
      ],
      tips: ['Ha vatten tillgängligt.', 'Var uppmärksam på tassar och trötthet.'],
    },
    {
      title: 'Klara en löprunda tillsammans',
      description: 'Spring en längre runda ihop där både du och hunden håller bra energi.',
      xpReward: 500,
      subtasks: [
        'Pass 1: Spring 2 km lugnt',
        'Pass 2: Spring 3 km med paus vid behov',
        'Pass 3: Spring 4 km tillsammans i lugnt tempo',
      ],
      tips: ['Det ska vara roligt för hunden.', 'Avsluta hellre pigga än helt slut.'],
    },
  ],
  quests: runningSharedQuests,
},
{
  title: 'Trailrunning nybörjare',
  icon: 'leaf-outline',
  subtitle: ['running'],
  summaryDescription: 'Lär dig springa i skog, terräng och på ojämnt underlag.',
  category: 'TRAINING',
  difficulty: 'HARD',
  focusLabel: 'Terränglöpning',
  totalXpReward: 2000,
  color: CATEGORY_COLORS.training,
  isPopular: false,
  milestones: [
    {
      title: 'Testa terräng',
      description: 'Börja springa på mjukare och mer varierat underlag.',
      xpReward: 400,
      subtasks: [
        'Pass 1: Spring 3 km på grusväg eller skogsstig',
        'Pass 2: Spring 20 minuter i lugn terräng',
        'Pass 3: Spring 4 km på varierat underlag',
      ],
      tips: ['Titta några meter framför dig.', 'Kortare steg ger bättre kontroll.'],
    },
    {
      title: 'Bygg styrka i kuperad terräng',
      description: 'Vänj kroppen vid backar, rötter och ojämn mark.',
      xpReward: 700,
      subtasks: [
        'Pass 1: Spring 5 km i lätt terräng',
        'Pass 2: Spring 6 korta backintervaller',
        'Pass 3: Spring 6 km på skogsstig',
      ],
      tips: ['Gå i branta backar om det behövs.', 'Fokusera på stabilitet.'],
    },
    {
      title: 'Klara en trailrunda',
      description: 'Spring en längre runda i terräng med lugnt och stabilt tempo.',
      xpReward: 900,
      subtasks: [
        'Pass 1: Spring 6 km i terräng',
        'Pass 2: Spring 4 km lugnt på stig',
        'Pass 3: Spring 8 km trail utan stress',
      ],
      tips: ['Tempot är långsammare i terräng.', 'Målet är kontroll och uthållighet.'],
    },
  ],
  quests: runningSharedQuests,
},
];
