import { CATEGORY_COLORS, type GoalTemplateSeed } from '../../template-seed-types';
import { strengthSharedQuests } from './training-types';

export const strengthGoals: GoalTemplateSeed[] = [
  // EASY
  {
    title: 'Börja gymma regelbundet',
    icon: 'fitness-outline',
    subtitle: ['strength'],
    summaryDescription: 'Skapa en hållbar vana och bli bekväm med gymmiljön.',
    category: 'TRAINING',
    difficulty: 'EASY',
    focusLabel: 'Rutiner',
    totalXpReward: 800,
    color: CATEGORY_COLORS.training,
    isPopular: true,
    milestones: [
      {
        title: 'Ta dig till gymmet',
        description: 'Målet är att bygga trygghet och skapa vana.',
        xpReward: 150,
        subtasks: [
          'Pass 1: Besök gymmet och testa några maskiner',
          'Pass 2: Träna 20 minuter på gymmet',
          'Pass 3: Träna 30 minuter på gymmet',
        ],
        tips: [
          'Ingen bryr sig om hur ny du är.',
          'Målet är att dyka upp.'
        ],
      },
      {
        title: 'Skapa träningsrutin',
        description: 'Börja träna regelbundet och hitta ett lugnt tempo.',
        xpReward: 200,
        subtasks: [
          'Pass 1: Träna helkropp 30 minuter',
          'Pass 2: Träna 2 gympass samma vecka',
          'Pass 3: Testa en ny övning',
        ],
        tips: [
          'Teknik är viktigare än tunga vikter.',
          'Jämför dig inte med andra.'
        ],
      },
      {
        title: 'Bli bekväm i gymmet',
        description: 'Nu handlar det om att gymmet ska börja kännas naturligt.',
        xpReward: 200,
        subtasks: [
          'Pass 1: Träna 40 minuter',
          'Pass 2: Testa fria vikter',
          'Pass 3: Träna 3 gånger samma vecka',
        ],
        tips: [
          'Alla har varit nybörjare.',
          'Små steg bygger självförtroende.'
        ],
      },
      {
        title: 'Gymma regelbundet',
        description: 'Nu har du byggt en grund och skapat en stabil vana.',
        xpReward: 250,
        subtasks: [
          'Pass 1: Träna 45 minuter',
          'Pass 2: Träna 3 gympass under veckan',
          'Pass 3: Följ ett enkelt träningsupplägg',
        ],
        tips: [
          'Konsekvens slår motivation.',
          'Du behöver inte vara perfekt för att utvecklas.'
        ],
      },
    ],
    quests: strengthSharedQuests,
  },

  {
    title: 'Våga gå till gymmet själv',
    icon: 'heart-outline',
    subtitle: ['strength'],
    summaryDescription: 'Bygg trygghet och självförtroende i gymmiljön.',
    category: 'TRAINING',
    difficulty: 'EASY',
    focusLabel: 'Självförtroende',
    totalXpReward: 600,
    color: CATEGORY_COLORS.training,
    isPopular: false,
    milestones: [
      {
        title: 'Ta första steget',
        description: 'Målet är att göra gymmet mindre läskigt.',
        xpReward: 150,
        subtasks: [
          'Besök gymmet ensam',
          'Gå runt och titta på utrustningen',
          'Träna 15 minuter själv',
        ],
        tips: [
          'Du behöver inte kunna allt.',
          'Ingen analyserar dig så mycket som du tror.'
        ],
      },
      {
        title: 'Känn dig tryggare',
        description: 'Börja känna dig mer bekväm i miljön.',
        xpReward: 200,
        subtasks: [
          'Träna 30 minuter ensam',
          'Testa 3 olika övningar',
          'Gå till gymmet trots låg motivation',
        ],
        tips: [
          'Självförtroende byggs genom repetition.',
          'Det blir lättare varje gång.'
        ],
      },
      {
        title: 'Gymma själv med trygghet',
        description: 'Nu handlar det om att känna att du faktiskt hör hemma där.',
        xpReward: 250,
        subtasks: [
          'Genomför ett helt gympass ensam',
          'Testa fria vikter eller ny maskin',
          'Träna två gånger samma vecka själv',
        ],
        tips: [
          'Du förtjänar att ta plats.',
          'Att vara nervös betyder inte att du gör fel.'
        ],
      },
    ],
    quests: strengthSharedQuests,
  },

  {
    title: 'Klara 10 armhävningar',
    icon: 'fitness-outline',
    subtitle: ['strength'],
    summaryDescription: 'Bygg styrka steg för steg tills du klarar 10 armhävningar.',
    category: 'TRAINING',
    difficulty: 'EASY',
    focusLabel: 'Överkroppsstyrka',
    totalXpReward: 1000,
    color: CATEGORY_COLORS.training,
    isPopular: false,
    milestones: [
      {
        title: 'Bygg grundstyrka',
        description: 'Börja stärka armar, bröst och bål.',
        xpReward: 200,
        subtasks: [
          'Pass 1: 5 armhävningar mot vägg x 3',
          'Pass 2: 8 armhävningar mot bänk x 3',
          'Pass 3: Plankan 20 sekunder x 3',
        ],
        tips: [
          'Teknik är viktigare än antal.',
          'Spänn bålen under armhävningen.'
        ],
      },
      {
        title: 'Närma dig golvet',
        description: 'Nu börjar du träna mer likt riktiga armhävningar.',
        xpReward: 250,
        subtasks: [
          'Pass 1: 5 knäarmhävningar x 3',
          'Pass 2: 8 knäarmhävningar x 3',
          'Pass 3: Försök göra 1 vanlig armhävning',
        ],
        tips: [
          'Små framsteg räknas.',
          'Det är normalt att det känns tungt.'
        ],
      },
      {
        title: 'Bygg uthållighet',
        description: 'Öka antalet repetitioner och stärk kontrollen.',
        xpReward: 250,
        subtasks: [
          'Pass 1: 3 vanliga armhävningar x 3',
          'Pass 2: 5 vanliga armhävningar',
          'Pass 3: 7 vanliga armhävningar',
        ],
        tips: [
          'Vila ordentligt mellan seten.',
          'Fortsätt även om progressionen känns långsam.'
        ],
      },
      {
        title: 'Klara 10 armhävningar',
        description: 'Nu är målet att klara 10 armhävningar utan paus.',
        xpReward: 300,
        subtasks: [
          'Pass 1: 8 armhävningar',
          'Pass 2: 9 armhävningar',
          'Pass 3: 10 armhävningar utan paus',
        ],
        tips: [
          'Fokusera på jämn rytm.',
          'Du är starkare än när du började.'
        ],
      },
    ],
    quests: strengthSharedQuests,
  },
  // EASY
{
  title: 'Klara 20 kg i bänkpress',
  icon: 'barbell-outline',
  subtitle: ['strength'],
  summaryDescription: 'Bygg grundstyrka och lär dig bänkpress steg för steg.',
  category: 'TRAINING',
  difficulty: 'EASY',
  focusLabel: 'Bänkpress',
  totalXpReward: 1200,
  color: CATEGORY_COLORS.training,
  isPopular: false,
  milestones: [
    {
      title: 'Lär dig rörelsen',
      description: 'Bygg trygghet och kontroll i bänkpress.',
      xpReward: 250,
      subtasks: [
        'Lär dig korrekt teknik med tom stång',
        'Träna 2 överkroppspass samma vecka',
        'Klara 10 repetitioner med lätt vikt',
      ],
      tips: [
        'Kontroll är viktigare än vikt.',
        'Spänn skuldrorna mot bänken.'
      ],
    },
    {
      title: 'Bygg grundstyrka',
      description: 'Nu börjar kroppen vänja sig vid pressövningar.',
      xpReward: 300,
      subtasks: [
        'Klara 10 kg i bänkpress',
        'Klara 15 kg i bänkpress',
        'Genomför ett bröst- och tricepspass',
      ],
      tips: [
        'Små ökningar räcker.',
        'Träna regelbundet istället för tungt.'
      ],
    },
    {
      title: 'Klara 20 kg i bänkpress',
      description: 'Nu är målet att pressa 20 kg med kontroll.',
      xpReward: 650,
      subtasks: [
        'Klara 17,5 kg i bänkpress',
        'Förbered ett tyngre pass',
        'Klara 20 kg i bänkpress',
      ],
      tips: [
        'Fokusera på jämn rörelse.',
        'Du bygger styrka varje vecka.'
      ],
    },
  ],
  quests: strengthSharedQuests,
},
{
  title: 'Klara 50 kg i marklyft',
  icon: 'barbell-outline',
  subtitle: ['strength'],
  summaryDescription: 'Lär dig marklyft och bygg grundstyrka steg för steg.',
  category: 'TRAINING',
  difficulty: 'EASY',
  focusLabel: 'Marklyft',
  totalXpReward: 1500,
  color: CATEGORY_COLORS.training,
  isPopular: false,
  milestones: [
    {
      title: 'Lär dig marklyft',
      description: 'Fokusera på teknik och kontroll.',
      xpReward: 300,
      subtasks: [
        'Lär dig korrekt marklyftsteknik',
        'Klara marklyft med lätt vikt',
        'Träna rygg och ben samma vecka',
      ],
      tips: [
        'Rak rygg och stabil bål är viktigast.',
        'Stressa inte vikterna.'
      ],
    },
    {
      title: 'Bygg grundstyrka',
      description: 'Nu börjar du vänja kroppen vid tyngre lyft.',
      xpReward: 400,
      subtasks: [
        'Klara 30 kg marklyft',
        'Klara 40 kg marklyft',
        'Genomför två marklyftspass samma vecka',
      ],
      tips: [
        'Små ökningar gör stor skillnad.',
        'Fokusera på teknik varje repetition.'
      ],
    },
    {
      title: 'Klara 50 kg i marklyft',
      description: 'Nu är målet att lyfta 50 kg med bra teknik.',
      xpReward: 800,
      subtasks: [
        'Klara 45 kg marklyft',
        'Förbered ett tyngre lyft',
        'Klara 50 kg marklyft',
      ],
      tips: [
        'Bra teknik först.',
        'Du är starkare än när du började.'
      ],
    },
  ],
  quests: strengthSharedQuests,
},
{
  title: 'Klara 50 kg i knäböj',
  icon: 'barbell-outline',
  subtitle: ['strength'],
  summaryDescription: 'Bygg styrka och kontroll tills du klarar 50 kg i knäböj.',
  category: 'TRAINING',
  difficulty: 'EASY',
  focusLabel: 'Knäböj',
  totalXpReward: 1500,
  color: CATEGORY_COLORS.training,
  isPopular: false,
  milestones: [
    {
      title: 'Lär dig knäböj',
      description: 'Bygg stabilitet och kontroll i rörelsen.',
      xpReward: 300,
      subtasks: [
        'Lär dig korrekt knäböjsteknik',
        'Klara kroppsviktsknäböj x 15',
        'Träna ben två gånger samma vecka',
      ],
      tips: [
        'Djup och kontroll är viktigare än vikt.',
        'Spänn bålen genom hela rörelsen.'
      ],
    },
    {
      title: 'Bygg benstyrka',
      description: 'Nu börjar du vänja kroppen vid belastning.',
      xpReward: 400,
      subtasks: [
        'Klara 30 kg knäböj',
        'Klara 40 kg knäböj',
        'Genomför ett tungt benpass',
      ],
      tips: [
        'Stressa inte progressionen.',
        'Små ökningar bygger styrka.'
      ],
    },
    {
      title: 'Klara 50 kg i knäböj',
      description: 'Nu är målet att klara 50 kg med kontroll.',
      xpReward: 800,
      subtasks: [
        'Klara 45 kg knäböj',
        'Förbered ett tyngre pass',
        'Klara 50 kg knäböj',
      ],
      tips: [
        'Kontrollera rörelsen hela vägen.',
        'Bra teknik först, vikt sen.'
      ],
    },
  ],
  quests: strengthSharedQuests,
},

  // MEDIUM
  {
    title: 'Bygga muskler',
    icon: 'fitness-outline',
    subtitle: ['strength'],
    summaryDescription: 'Bygg styrka och muskelmassa genom regelbunden styrketräning.',
    category: 'TRAINING',
    difficulty: 'MEDIUM',
    focusLabel: 'Muskeluppbyggnad',
    totalXpReward: 2500,
    color: CATEGORY_COLORS.training,
    isPopular: true,
    milestones: [
      {
        title: 'Lär dig grunderna',
        description: 'Fokusera på teknik och regelbunden träning.',
        xpReward: 500,
        subtasks: [
          'Träna helkropp 2 gånger samma vecka',
          'Lär dig knäböj, press och rodd',
          'Skriv ner vikter och repetitioner',
        ],
        tips: [
          'Bra teknik bygger långsiktig styrka.',
          'Stressa inte vikterna.'
        ],
      },
            {
        title: 'Öka träningsvolymen',
        description: 'Nu vänjer sig kroppen vid mer belastning och fler träningspass.',
        xpReward: 600,
        subtasks: [
          'Träna 3 gånger samma vecka',
          'Gör 3 set på basövningar',
          'Öka vikten i minst en övning',
        ],
        tips: [
          'Sömn och mat påverkar resultaten mycket.',
          'Konsekvens är viktigare än perfekta pass.'
        ],
      },
      {
        title: 'Bygg styrka och kontroll',
        description: 'Nu börjar du känna dig starkare och säkrare i gymmet.',
        xpReward: 700,
        subtasks: [
          'Träna 4 gånger samma vecka',
          'Klara ett tungt benpass',
          'Klara ett tungt överkroppspass',
        ],
        tips: [
          'Vila är en del av träningen.',
          'Progression tar tid.'
        ],
      },
      {
        title: 'Bygg muskler regelbundet',
        description: 'Nu har du byggt en stabil grund för fortsatt utveckling.',
        xpReward: 700,
        subtasks: [
          'Följ träningsschema i 2 veckor',
          'Öka vikter kontrollerat',
          'Genomför alla planerade pass',
        ],
        tips: [
          'Jämför dig bara med dig själv.',
          'Små framsteg blir stora över tid.'
        ],
      },
    ],
    quests: strengthSharedQuests,
  },
  // MEDIUM
{
  title: 'Klara 60 kg i marklyft',
  icon: 'barbell-outline',
  subtitle: ['strength'],
  summaryDescription: 'Bygg vidare från grundstyrka och klara 60 kg i marklyft.',
  category: 'TRAINING',
  difficulty: 'MEDIUM',
  focusLabel: 'Marklyft',
  totalXpReward: 2500,
  color: CATEGORY_COLORS.training,
  isPopular: false,
  milestones: [
    {
      title: 'Bygg stabil teknik',
      description: 'Fortsätt utveckla teknik och kontroll.',
      xpReward: 500,
      subtasks: [
        'Klara 50 kg marklyft',
        'Träna marklyft 2 gånger samma vecka',
        'Filma och analysera ett lyft',
      ],
      tips: [
        'Bra teknik bygger långsiktig styrka.',
        'Stressa inte progressionen.'
      ],
    },
    {
      title: 'Bygg styrka från golvet',
      description: 'Nu börjar vikterna bli mer utmanande.',
      xpReward: 700,
      subtasks: [
        'Klara 55 kg marklyft',
        'Genomför ett tungt ryggpass',
        'Genomför ett tungt benpass',
      ],
      tips: [
        'Spänn bålen innan varje lyft.',
        'Vila ordentligt mellan tunga set.'
      ],
    },
    {
      title: 'Klara 60 kg i marklyft',
      description: 'Nu är målet att lyfta 60 kg med bra teknik.',
      xpReward: 1300,
      subtasks: [
        'Klara 57,5 kg marklyft',
        'Förbered ett tyngre pass',
        'Klara 60 kg marklyft',
      ],
      tips: [
        'Bra teknik först.',
        'Du är starkare än när du började.'
      ],
    },
  ],
  quests: strengthSharedQuests,
},
{
  title: 'Klara 60 kg i knäböj',
  icon: 'barbell-outline',
  subtitle: ['strength'],
  summaryDescription: 'Bygg vidare på din benstyrka och klara 60 kg i knäböj.',
  category: 'TRAINING',
  difficulty: 'MEDIUM',
  focusLabel: 'Knäböj',
  totalXpReward: 2500,
  color: CATEGORY_COLORS.training,
  isPopular: false,
  milestones: [
    {
      title: 'Förstärk grunden',
      description: 'Bygg stabilitet och trygghet i knäböjen.',
      xpReward: 500,
      subtasks: [
        'Klara 50 kg knäböj',
        'Träna ben två gånger samma vecka',
        'Genomför ett benpass med fokus på teknik',
      ],
      tips: [
        'Djup och kontroll är viktigare än vikt.',
        'Spänn bålen genom hela rörelsen.'
      ],
    },
    {
      title: 'Bygg benstyrka',
      description: 'Nu vänjer sig kroppen vid tyngre belastning.',
      xpReward: 700,
      subtasks: [
        'Klara 55 kg knäböj',
        'Genomför ett tungt benpass',
        'Öka vikten kontrollerat under veckan',
      ],
      tips: [
        'Små ökningar räcker.',
        'Fokusera på stabilitet och kontroll.'
      ],
    },
    {
      title: 'Klara 60 kg i knäböj',
      description: 'Nu är målet att klara 60 kg med bra teknik.',
      xpReward: 1300,
      subtasks: [
        'Klara 57,5 kg knäböj',
        'Förbered ett tyngre pass',
        'Klara 60 kg knäböj',
      ],
      tips: [
        'Bra teknik först.',
        'Bygg styrka långsiktigt.'
      ],
    },
  ],
  quests: strengthSharedQuests,
},
{
  title: 'Klara 40 kg i bänkpress',
  icon: 'barbell-outline',
  subtitle: ['strength'],
  summaryDescription: 'Bygg pressstyrka och klara 40 kg i bänkpress.',
  category: 'TRAINING',
  difficulty: 'MEDIUM',
  focusLabel: 'Bänkpress',
  totalXpReward: 3000,
  color: CATEGORY_COLORS.training,
  isPopular: false,
  milestones: [
    {
      title: 'Förbättra tekniken',
      description: 'Bygg stabilitet och kontroll i bänkpressen.',
      xpReward: 600,
      subtasks: [
        'Klara 20 kg i bänkpress',
        'Träna överkropp två gånger samma vecka',
        'Lär dig stabil setup i bänkpress',
      ],
      tips: [
        'Spänn skuldrorna mot bänken.',
        'Kontrollera stången genom hela rörelsen.'
      ],
    },
    {
      title: 'Bygg pressstyrka',
      description: 'Nu börjar vikterna bli mer utmanande.',
      xpReward: 900,
      subtasks: [
        'Klara 30 kg i bänkpress',
        'Genomför ett tungt bröstpass',
        'Öka vikten under flera pass',
      ],
      tips: [
        'Små ökningar gör stor skillnad.',
        'Stressa inte progressionen.'
      ],
    },
    {
      title: 'Klara 40 kg i bänkpress',
      description: 'Nu är målet att pressa 40 kg med kontroll.',
      xpReward: 1500,
      subtasks: [
        'Klara 35 kg i bänkpress',
        'Förbered ett tyngre pass',
        'Klara 40 kg i bänkpress',
      ],
      tips: [
        'Bra teknik först.',
        'Bygg självförtroende stegvis.'
      ],
    },
  ],
  quests: strengthSharedQuests,
},

  // HARD
  {
    title: 'Bli starkare i basövningar',
    icon: 'fitness-outline',
    subtitle: ['strength'],
    summaryDescription: 'Bygg styrka i knäböj, marklyft och bänkpress.',
    category: 'TRAINING',
    difficulty: 'HARD',
    focusLabel: 'Styrka',
    totalXpReward: 4000,
    color: CATEGORY_COLORS.training,
    isPopular: false,
    milestones: [
      {
        title: 'Lär dig basövningarna',
        description: 'Fokusera på teknik och kontroll.',
        xpReward: 800,
        subtasks: [
          'Lär dig knäböj med korrekt teknik',
          'Lär dig marklyft med lätt vikt',
          'Lär dig bänkpress med kontroll',
        ],
        tips: [
          'Bra teknik är viktigare än tunga vikter.',
          'Filma gärna dig själv för att se tekniken.'
        ],
      },
      {
        title: 'Bygg grundstyrka',
        description: 'Nu börjar du vänja kroppen vid tyngre belastning.',
        xpReward: 1000,
        subtasks: [
          'Öka vikten i knäböj',
          'Öka vikten i marklyft',
          'Öka vikten i bänkpress',
        ],
        tips: [
          'Små ökningar räcker långt.',
          'Vila ordentligt mellan tunga pass.'
        ],
      },
      {
        title: 'Träna tungt och kontrollerat',
        description: 'Bygg stabil styrka genom konsekvent träning.',
        xpReward: 1000,
        subtasks: [
          'Genomför 3 styrkepass samma vecka',
          'Klara ett tungt benpass',
          'Klara ett tungt överkroppspass',
        ],
        tips: [
          'Stressa inte progressionen.',
          'Teknik först, vikt sen.'
        ],
      },
      {
        title: 'Bli starkare i basövningar',
        description: 'Nu har du byggt en stark grund i gymmet.',
        xpReward: 1200,
        subtasks: [
          'Slå personbästa i valfri basövning',
          'Följ träningsschema i 3 veckor',
          'Genomför alla planerade styrkepass',
        ],
        tips: [
          'Styrka byggs över lång tid.',
          'Konsekvens slår perfektion.'
        ],
      },
    ],
    quests: strengthSharedQuests,
  },
  // HARD
{
  title: 'Klara 100 kg i marklyft',
  icon: 'barbell-outline',
  subtitle: ['strength'],
  summaryDescription: 'Bygg upp styrkan och tekniken för att marklyfta 100 kg.',
  category: 'TRAINING',
  difficulty: 'HARD',
  focusLabel: 'Marklyft',
  totalXpReward: 5000,
  color: CATEGORY_COLORS.training,
  isPopular: false,
  milestones: [
    {
      title: 'Bygg tung grundstyrka',
      description: 'Nu börjar vikterna bli mentalt och fysiskt utmanande.',
      xpReward: 1000,
      subtasks: [
        'Klara 60 kg marklyft',
        'Klara 70 kg marklyft',
        'Genomför två tunga ryggpass samma vecka',
      ],
      tips: [
        'Fokusera på explosivitet från golvet.',
        'Stressa inte progressionen.'
      ],
    },
    {
      title: 'Närma dig tresiffrigt',
      description: 'Nu bygger du styrka nära målvikten.',
      xpReward: 1300,
      subtasks: [
        'Klara 80 kg marklyft',
        'Klara 90 kg marklyft',
        'Filma och analysera ett tungt lyft',
      ],
      tips: [
        'Vila ordentligt mellan tunga set.',
        'Teknik först, ego sen.'
      ],
    },
    {
      title: 'Klara 100 kg i marklyft',
      description: 'Nu är målet att lyfta 100 kg med bra teknik.',
      xpReward: 2700,
      subtasks: [
        'Klara 95 kg marklyft',
        'Förbered ett maxningspass',
        'Klara 100 kg marklyft',
      ],
      tips: [
        'Ha tålamod med progressionen.',
        'Bra teknik är viktigare än siffran.'
      ],
    },
  ],
  quests: strengthSharedQuests,
},
{
  title: 'Klara 100 kg i knäböj',
  icon: 'barbell-outline',
  subtitle: ['strength'],
  summaryDescription: 'Bygg styrka och stabilitet tills du klarar 100 kg i knäböj.',
  category: 'TRAINING',
  difficulty: 'HARD',
  focusLabel: 'Knäböj',
  totalXpReward: 5000,
  color: CATEGORY_COLORS.training,
  isPopular: false,
  milestones: [
    {
      title: 'Bygg tung benstyrka',
      description: 'Nu börjar kroppen vänja sig vid riktigt tunga böj.',
      xpReward: 1000,
      subtasks: [
        'Klara 60 kg knäböj',
        'Klara 70 kg knäböj',
        'Genomför två tunga benpass samma vecka',
      ],
      tips: [
        'Spänn bålen genom hela rörelsen.',
        'Djup och kontroll först.'
      ],
    },
    {
      title: 'Närma dig 100 kg',
      description: 'Nu blir både styrka och teknik avgörande.',
      xpReward: 1300,
      subtasks: [
        'Klara 80 kg knäböj',
        'Klara 90 kg knäböj',
        'Följ benprogram i 2 veckor',
      ],
      tips: [
        'Stressa inte progressionen.',
        'Små ökningar gör stor skillnad.'
      ],
    },
    {
      title: 'Klara 100 kg i knäböj',
      description: 'Nu är målet att klara 100 kg med kontroll.',
      xpReward: 2700,
      subtasks: [
        'Klara 95 kg knäböj',
        'Förbered ett maxningspass',
        'Klara 100 kg knäböj',
      ],
      tips: [
        'Bra teknik först.',
        'Du är starkare än när du började.'
      ],
    },
  ],
  quests: strengthSharedQuests,
},
{
  title: 'Klara 60 kg i bänkpress',
  icon: 'barbell-outline',
  subtitle: ['strength'],
  summaryDescription: 'Bygg upp styrka och kontroll tills du klarar 60 kg i bänkpress.',
  category: 'TRAINING',
  difficulty: 'HARD',
  focusLabel: 'Bänkpress',
  totalXpReward: 5000,
  color: CATEGORY_COLORS.training,
  isPopular: false,
  milestones: [
    {
      title: 'Bygg tung pressstyrka',
      description: 'Nu börjar vikterna bli ordentligt utmanande.',
      xpReward: 1000,
      subtasks: [
        'Klara 40 kg i bänkpress',
        'Klara 50 kg i bänkpress',
        'Genomför två överkroppspass samma vecka',
      ],
      tips: [
        'Kontrollera stången hela vägen.',
        'Bygg självförtroende stegvis.'
      ],
    },
    {
      title: 'Närma dig målvikten',
      description: 'Nu bygger du styrka nära slutmålet.',
      xpReward: 1300,
      subtasks: [
        'Klara 55 kg i bänkpress',
        'Genomför ett tungt bröstpass',
        'Öka vikten under flera pass',
      ],
      tips: [
        'Små ökningar räcker.',
        'Stressa inte maxförsök.'
      ],
    },
    {
      title: 'Klara 60 kg i bänkpress',
      description: 'Nu är målet att pressa 60 kg med kontroll.',
      xpReward: 2700,
      subtasks: [
        'Klara 57,5 kg i bänkpress',
        'Förbered ett maxningspass',
        'Klara 60 kg i bänkpress',
      ],
      tips: [
        'Bra teknik först.',
        'Långsiktig progression bygger styrka.'
      ],
    },
  ],
  quests: strengthSharedQuests,
},


  // EPIC
  {
    title: 'Bygg en stark fysik',
    icon: 'fitness-outline',
    subtitle: ['strength'],
    summaryDescription: 'Utveckla styrka, disciplin och en stark kropp genom långsiktig träning.',
    category: 'TRAINING',
    difficulty: 'EPIC',
    focusLabel: 'Fysik och disciplin',
    totalXpReward: 7000,
    color: CATEGORY_COLORS.training,
    isPopular: false,
    milestones: [
      {
        title: 'Skapa struktur',
        description: 'Bygg ett träningsupplägg du faktiskt kan följa.',
        xpReward: 1200,
        subtasks: [
          'Planera ett veckoschema',
          'Träna 4 gånger samma vecka',
          'Följ samma träningsschema i 2 veckor',
        ],
        tips: [
          'Rutiner gör träningen enklare.',
          'Försök inte optimera allt direkt.'
        ],
      },
      {
        title: 'Bygg muskelmassa',
        description: 'Nu handlar det om konsekvent progression över tid.',
        xpReward: 1700,
        subtasks: [
          'Öka vikter i flera övningar',
          'Klara 4 gympass samma vecka',
          'Få in tillräckligt med protein varje dag i en vecka',
        ],
        tips: [
          'Återhämtning är avgörande.',
          'Små framsteg räknas.'
        ],
      },
      {
        title: 'Träna med disciplin',
        description: 'Nu bygger du mental styrka lika mycket som fysisk styrka.',
        xpReward: 1900,
        subtasks: [
          'Träna trots låg motivation',
          'Genomför alla veckans pass',
          'Fortsätt även om progressionen känns långsam',
        ],
        tips: [
          'Disciplin tar dig längre än motivation.',
          'Alla utvecklas i olika takt.'
        ],
      },
      {
        title: 'Bygg en stark fysik',
        description: 'Nu har du byggt en stabil grund av styrka, disciplin och rutiner.',
        xpReward: 2200,
        subtasks: [
          'Följ träningsschema i 1 månad',
          'Klara ett tungt helkroppspass',
          'Genomför alla planerade träningspass',
        ],
        tips: [
          'Du är starkare än när du började.',
          'Långsiktighet är nyckeln.'
        ],
      },
    ],
    quests: strengthSharedQuests,
  },
  // HARD
{
  title: 'Klara 100 kg i marklyft',
  icon: 'barbell-outline',
  subtitle: ['strength'],
  summaryDescription: 'Bygg upp styrkan och tekniken för att marklyfta 100 kg.',
  category: 'TRAINING',
  difficulty: 'HARD',
  focusLabel: 'Marklyft',
  totalXpReward: 5000,
  color: CATEGORY_COLORS.training,
  isPopular: false,
  milestones: [
    {
      title: 'Bygg tung grundstyrka',
      description: 'Nu börjar vikterna bli mentalt och fysiskt utmanande.',
      xpReward: 1000,
      subtasks: [
        'Klara 60 kg marklyft',
        'Klara 70 kg marklyft',
        'Genomför två tunga ryggpass samma vecka',
      ],
      tips: [
        'Fokusera på explosivitet från golvet.',
        'Stressa inte progressionen.'
      ],
    },
    {
      title: 'Närma dig tresiffrigt',
      description: 'Nu bygger du styrka nära målvikten.',
      xpReward: 1300,
      subtasks: [
        'Klara 80 kg marklyft',
        'Klara 90 kg marklyft',
        'Filma och analysera ett tungt lyft',
      ],
      tips: [
        'Vila ordentligt mellan tunga set.',
        'Teknik först, ego sen.'
      ],
    },
    {
      title: 'Klara 100 kg i marklyft',
      description: 'Nu är målet att lyfta 100 kg med bra teknik.',
      xpReward: 2700,
      subtasks: [
        'Klara 95 kg marklyft',
        'Förbered ett maxningspass',
        'Klara 100 kg marklyft',
      ],
      tips: [
        'Ha tålamod med progressionen.',
        'Bra teknik är viktigare än siffran.'
      ],
    },
  ],
  quests: strengthSharedQuests,
},
{
  title: 'Klara 100 kg i knäböj',
  icon: 'barbell-outline',
  subtitle: ['strength'],
  summaryDescription: 'Bygg styrka och stabilitet tills du klarar 100 kg i knäböj.',
  category: 'TRAINING',
  difficulty: 'HARD',
  focusLabel: 'Knäböj',
  totalXpReward: 5000,
  color: CATEGORY_COLORS.training,
  isPopular: false,
  milestones: [
    {
      title: 'Bygg tung benstyrka',
      description: 'Nu börjar kroppen vänja sig vid riktigt tunga böj.',
      xpReward: 1000,
      subtasks: [
        'Klara 60 kg knäböj',
        'Klara 70 kg knäböj',
        'Genomför två tunga benpass samma vecka',
      ],
      tips: [
        'Spänn bålen genom hela rörelsen.',
        'Djup och kontroll först.'
      ],
    },
    {
      title: 'Närma dig 100 kg',
      description: 'Nu blir både styrka och teknik avgörande.',
      xpReward: 1300,
      subtasks: [
        'Klara 80 kg knäböj',
        'Klara 90 kg knäböj',
        'Följ benprogram i 2 veckor',
      ],
      tips: [
        'Stressa inte progressionen.',
        'Små ökningar gör stor skillnad.'
      ],
    },
    {
      title: 'Klara 100 kg i knäböj',
      description: 'Nu är målet att klara 100 kg med kontroll.',
      xpReward: 2700,
      subtasks: [
        'Klara 95 kg knäböj',
        'Förbered ett maxningspass',
        'Klara 100 kg knäböj',
      ],
      tips: [
        'Bra teknik först.',
        'Du är starkare än när du började.'
      ],
    },
  ],
  quests: strengthSharedQuests,
},
{
  title: 'Klara 60 kg i bänkpress',
  icon: 'barbell-outline',
  subtitle: ['strength'],
  summaryDescription: 'Bygg upp styrka och kontroll tills du klarar 60 kg i bänkpress.',
  category: 'TRAINING',
  difficulty: 'HARD',
  focusLabel: 'Bänkpress',
  totalXpReward: 5000,
  color: CATEGORY_COLORS.training,
  isPopular: false,
  milestones: [
    {
      title: 'Bygg tung pressstyrka',
      description: 'Nu börjar vikterna bli ordentligt utmanande.',
      xpReward: 1000,
      subtasks: [
        'Klara 40 kg i bänkpress',
        'Klara 50 kg i bänkpress',
        'Genomför två överkroppspass samma vecka',
      ],
      tips: [
        'Kontrollera stången hela vägen.',
        'Bygg självförtroende stegvis.'
      ],
    },
    {
      title: 'Närma dig målvikten',
      description: 'Nu bygger du styrka nära slutmålet.',
      xpReward: 1300,
      subtasks: [
        'Klara 55 kg i bänkpress',
        'Genomför ett tungt bröstpass',
        'Öka vikten under flera pass',
      ],
      tips: [
        'Små ökningar räcker.',
        'Stressa inte maxförsök.'
      ],
    },
    {
      title: 'Klara 60 kg i bänkpress',
      description: 'Nu är målet att pressa 60 kg med kontroll.',
      xpReward: 2700,
      subtasks: [
        'Klara 57,5 kg i bänkpress',
        'Förbered ett maxningspass',
        'Klara 60 kg i bänkpress',
      ],
      tips: [
        'Bra teknik först.',
        'Långsiktig progression bygger styrka.'
      ],
    },
  ],
  quests: strengthSharedQuests,
},
  // LEGENDARY
{
  title: 'Bygg extrem styrka',
  icon: 'fitness-outline',
  subtitle: ['strength'],
  summaryDescription: 'Bygg en mycket stark kropp genom långsiktig, tung och konsekvent styrketräning.',
  category: 'TRAINING',
  difficulty: 'LEGENDARY',
  focusLabel: 'Maxstyrka',
  totalXpReward: 10000,
  color: CATEGORY_COLORS.training,
  isPopular: false,
  milestones: [
    {
      title: 'Bygg en stark grund',
      description: 'Skapa stabilitet, teknik och rutin för tung styrketräning.',
      xpReward: 1500,
      subtasks: [
        'Träna styrka 4 gånger samma vecka',
        'Följ ett träningsschema i 2 veckor',
        'Dokumentera vikter, set och repetitioner varje pass',
      ],
      tips: [
        'Tung träning kräver bra teknik.',
        'Skriv ner allt så du kan följa progressionen.'
      ],
    },
    {
      title: 'Öka belastningen kontrollerat',
      description: 'Börja bygga styrka genom planerad progression.',
      xpReward: 1800,
      subtasks: [
        'Öka vikten i minst 3 övningar',
        'Genomför ett tungt benpass',
        'Genomför ett tungt överkroppspass',
      ],
      tips: [
        'Små ökningar är fortfarande progression.',
        'Stressa inte fram tyngre vikter.'
      ],
    },
    {
      title: 'Bygg maxstyrka',
      description: 'Träna kroppen för att hantera riktigt tung belastning.',
      xpReward: 2000,
      subtasks: [
        'Klara 5 tunga reps i knäböj',
        'Klara 5 tunga reps i marklyft',
        'Klara 5 tunga reps i bänkpress eller press',
      ],
      tips: [
        'Vila längre mellan tunga set.',
        'Avbryt hellre än att lyfta med dålig teknik.'
      ],
    },
    {
      title: 'Håll disciplinen över tid',
      description: 'Nu handlar det om långsiktig konsekvens och återhämtning.',
      xpReward: 2200,
      subtasks: [
        'Följ träningsschema i 1 månad',
        'Genomför alla planerade pass under 2 veckor',
        'Prioritera sömn och återhämtning i 7 dagar',
      ],
      tips: [
        'Styrka byggs mellan passen också.',
        'Återhämtning är en del av målet.'
      ],
    },
    {
      title: 'Nå en ny styrkenivå',
      description: 'Slutför målet genom att visa tydlig utveckling i styrka och kontroll.',
      xpReward: 2500,
      subtasks: [
        'Slå personbästa i valfri basövning',
        'Genomför ett tungt helkroppspass',
        'Utvärdera din utveckling och sätt nästa styrkemål',
      ],
      tips: [
        'Fira utvecklingen, inte bara slutresultatet.',
        'Nästa nivå börjar med en stark grund.'
      ],
    },
  ],
  quests: strengthSharedQuests,
},
// LEGENDARY
{
  title: 'Klara 180 kg i marklyft',
  icon: 'barbell-outline',
  subtitle: ['strength'],
  summaryDescription: 'Bygg extrem dragstyrka och klara 180 kg i marklyft.',
  category: 'TRAINING',
  difficulty: 'LEGENDARY',
  focusLabel: 'Maxstyrka',
  totalXpReward: 12000,
  color: CATEGORY_COLORS.training,
  isPopular: false,
  milestones: [
    {
      title: 'Bygg från avancerad styrka',
      description: 'Nu handlar det om långsiktig progression mot riktigt tunga lyft.',
      xpReward: 2500,
      subtasks: [
        'Klara 140 kg marklyft',
        'Klara 150 kg marklyft',
        'Följ styrkeprogram i 3 veckor',
      ],
      tips: [
        'Tunga lyft kräver tålamod.',
        'Prioritera teknik och återhämtning.'
      ],
    },
    {
      title: 'Närma dig extrem styrka',
      description: 'Nu blir sömn, mat och planering avgörande.',
      xpReward: 3500,
      subtasks: [
        'Klara 160 kg marklyft',
        'Klara 170 kg marklyft',
        'Genomför ett tungt rygg- och benpass',
      ],
      tips: [
        'Maxstyrka byggs långsamt.',
        'Vila ordentligt mellan tunga set.'
      ],
    },
    {
      title: 'Klara 180 kg i marklyft',
      description: 'Nu är målet att lyfta 180 kg med kontroll.',
      xpReward: 6000,
      subtasks: [
        'Klara 175 kg marklyft',
        'Förbered ett maxningspass',
        'Klara 180 kg marklyft',
      ],
      tips: [
        'Stressa inte maxförsök.',
        'Teknik först, vikt sen.'
      ],
    },
  ],
  quests: strengthSharedQuests,
},
{
  title: 'Klara 180 kg i knäböj',
  icon: 'barbell-outline',
  subtitle: ['strength'],
  summaryDescription: 'Bygg extrem benstyrka och klara 180 kg i knäböj.',
  category: 'TRAINING',
  difficulty: 'LEGENDARY',
  focusLabel: 'Benstyrka',
  totalXpReward: 12000,
  color: CATEGORY_COLORS.training,
  isPopular: false,
  milestones: [
    {
      title: 'Bygg från avancerad styrka',
      description: 'Nu tar du steget från tung till extrem benstyrka.',
      xpReward: 2500,
      subtasks: [
        'Klara 140 kg knäböj',
        'Klara 150 kg knäböj',
        'Följ benprogram i 3 veckor',
      ],
      tips: [
        'Djup och kontroll är viktigare än siffran.',
        'Små ökningar bygger stor styrka över tid.'
      ],
    },
    {
      title: 'Närma dig extrem styrka',
      description: 'Nu krävs disciplin, återhämtning och stabil teknik.',
      xpReward: 3500,
      subtasks: [
        'Klara 160 kg knäböj',
        'Klara 170 kg knäböj',
        'Genomför två tunga benpass samma vecka',
      ],
      tips: [
        'Spänn bålen genom hela lyftet.',
        'Vila ordentligt mellan tunga pass.'
      ],
    },
    {
      title: 'Klara 180 kg i knäböj',
      description: 'Nu är målet att klara 180 kg med kontroll.',
      xpReward: 6000,
      subtasks: [
        'Klara 175 kg knäböj',
        'Förbered ett maxningspass',
        'Klara 180 kg knäböj',
      ],
      tips: [
        'Bra teknik först.',
        'Bygg trygghet innan maxlyft.'
      ],
    },
  ],
  quests: strengthSharedQuests,
},
{
  title: 'Klara 120 kg i bänkpress',
  icon: 'barbell-outline',
  subtitle: ['strength'],
  summaryDescription: 'Bygg extrem pressstyrka och klara 120 kg i bänkpress.',
  category: 'TRAINING',
  difficulty: 'LEGENDARY',
  focusLabel: 'Bänkpress',
  totalXpReward: 12000,
  color: CATEGORY_COLORS.training,
  isPopular: false,
  milestones: [
    {
      title: 'Bygg från avancerad pressstyrka',
      description: 'Nu fortsätter du från tresiffrig press mot ännu tyngre vikter.',
      xpReward: 2500,
      subtasks: [
        'Klara 100 kg i bänkpress',
        'Klara 105 kg i bänkpress',
        'Följ pressprogram i 3 veckor',
      ],
      tips: [
        'Kontrollera stången hela vägen.',
        'Återhämtning är avgörande.'
      ],
    },
    {
      title: 'Närma dig extrem pressstyrka',
      description: 'Nu krävs stabil teknik och långsiktig progression.',
      xpReward: 3500,
      subtasks: [
        'Klara 110 kg i bänkpress',
        'Klara 115 kg i bänkpress',
        'Genomför två tunga överkroppspass samma vecka',
      ],
      tips: [
        'Ha alltid säkerhet vid tunga lyft.',
        'Små ökningar räcker.'
      ],
    },
    {
      title: 'Klara 120 kg i bänkpress',
      description: 'Nu är målet att pressa 120 kg med kontroll.',
      xpReward: 6000,
      subtasks: [
        'Klara 117,5 kg i bänkpress',
        'Förbered ett maxningspass',
        'Klara 120 kg i bänkpress',
      ],
      tips: [
        'Stressa inte maxförsök.',
        'Bra setup gör stor skillnad.'
      ],
    },
  ],
  quests: strengthSharedQuests,
},
];
