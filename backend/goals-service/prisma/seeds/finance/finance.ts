import type { GoalTemplateSeed } from '../template-seed-types';
import { EverydaySavingSharedQuests } from './finance-types';
export const financeGoalTemplates: GoalTemplateSeed[] = [
  // EASY
  {
    title: 'Minska onödiga utgifter',
    icon: 'wallet-outline',
    subtitle: ['finance'],
    summaryDescription: 'Få bättre kontroll över din ekonomi genom att minska små onödiga köp.',
    detailDescription:
      '',
    category: 'FINANCE',
    difficulty: 'EASY',
    goalXpReward: 100,
    totalXpReward: 600,
    color: '#56D2C5',
    isPopular: true,
    details: [
      { label: 'Kategori', value: 'Ekonomi', visibility: 'SUMMARY' },
      { label: 'Upplägg', value: 'utvecklingssteg', visibility: 'SUMMARY' },
      { label: 'Fokus', value: 'Sparande och trygghet', visibility: 'SUMMARY' },
      { label: 'Metod', value: 'Kartläggning, budget och löpande sparmål', visibility: 'DETAIL' },
    ],
    milestones: [
     {
        title: 'Kartlägg  utgifter',
        description: 'Få en överblick över vad dina pengar går till.',
        xpReward: 50,
        subtasks: [
          'Skriv ner alla dina köp under den senaste månaden',
          'Identifiera minst 3 onödiga utgifter',
          'Skapa inköpslistor för dina vanliga inköp',
          'Sätt upp ett maxbelopp för utgifter per vecka'
        ],
        tips: [
          'Finns det abonnemang du inte använder?',
          'Finns det billigare alternativ till dina vanliga köp?',
        ],
      }, {
        title: 'Första veckan utan onödiga köp',
        description:'Skapa bättre vanor och minska småutgifter.',
        xpReward: 100,
        subtasks: [
          'Klara en veckans maxbelopp',
          'Följ dina inköpslistor i en hel vecka',
        ],
        tips: [
          'Håll dig till inköpslistor och maxbelopp',
          'Undvik takeaway och impulsköp',
        ],
      },
      {
        title: 'Andra veckan utan onödiga köp',
        description:'Fortsätt bygga dina ekonomiska vanor.',
        xpReward: 100,
        subtasks: [
          'Klara ännu en vecka inom veckans maxbelopp',
          'Följ dina inköpslistor i ytterligare en vecka',
        ],
        tips: [
          'Du har redan klarat en vecka, fortsätt så!',
          'Fira dina framsteg och påminn dig om varför du gör detta',
        ],
      }, 
      {
        title: 'Tredje veckan utan onödiga köp',
        description:'Nästan där! Du är redan halvvägs!',
        xpReward: 100,
        subtasks: [
         'Klara ännu en vecka inom veckans maxbelopp',
         'Följ dina inköpslistor i ytterligare en vecka',
        ],
        tips: [
          'Du har redan klarat två veckor, fortsätt så!', 
          'Fira dina framsteg och påminn dig om varför du gör detta'],
      },
      {
        title: 'Första månaden utan onödiga köp',
        description:'Nästan där! Snart har du klara en hel månad av bättre ekonomiska vanor.',
        xpReward: 250,
        subtasks: [
         'Klara ännu en vecka inom veckans maxbelopp',
         'Följ dina inköpslistor i ytterligare en vecka',
        ],
        tips: ['Du är snart i mål, fortsätt så!'],
      }
    ],
    quests: EverydaySavingSharedQuests,
  },
  // { title: 'Spara 1000 kr',
  //   icon: 'cash-outline',
  //   subtitle: ['finance'],
  //   summaryDescription: 'Börja bygga upp ditt sparkapital.',
  //   detailDescription:
  //     '',
  //   category: 'FINANCE',
  //   difficulty: 'EASY',
  //   goalXpReward: 100,
  //   totalXpReward: 100,
  //   color: '#56D2C5',
  //   isPopular: false,
  //   details: [
  //     { label: 'Kategori', value: 'Ekonomi', visibility: 'SUMMARY' },
  //     { label: 'Upplägg', value: 'engångsmål', visibility: 'SUMMARY' },
  //   ],
  //   milestones: [
  //     {
  //       title: '',
  //       description: '',
  //       xpReward: 100,
  //       subtasks: [{}],
  //       tips: []},
  //     },
  //   ],
  // },
  // MEDIUM
  {
    title: 'Bli en cykelpendlare',
    icon: 'bicycle-outline',
    subtitle: ['finance', 'training'],
    summaryDescription:
      'Minska på dina transportkostnader och spara på miljön genom att börja cykelpendla istället för att åka bil.',
    detailDescription:
      '',
    category: 'FINANCE',
    difficulty: 'MEDIUM',
    goalXpReward: 100,
    totalXpReward: 600,
    color: '#56D2C5',
    isPopular: true,
    details: [
      { label: 'Kategori', value: 'Ekonomi', visibility: 'SUMMARY' },
      { label: 'Upplägg', value: 'utvecklingssteg', visibility: 'SUMMARY' },
      { label: 'Fokus', value: 'Minskade transportkostnader', visibility: 'SUMMARY' },
      { label: 'Metod', value: 'Planering, cykelpendling och veckomål', visibility: 'DETAIL' },
    ],
    milestones: [
      {
        title: 'Förbered cykelpendling',
        description: 'Gör det enkelt att välja cykeln istället för bilen.',
        xpReward: 50,
        subtasks: [
          'Räkna ut ungefär vad en bilresa till destinationen kostar',
          'Se över din cykel, pumpa exempelvis däcken',
          'Planera hur mycket tid du behöver för att cykla till destinationen',
        ],
        tips: [
          'Planera kläder efter väder dagen innan',
          'För varje cykelresa sparar du både pengar och miljö'
        ],
      },
      {
        title: 'Första veckan',
        description: 'Kom igång med att byta ut några bilresor mot cykel.',
        xpReward: 50,
        subtasks: [
          'Cykla till jobbet minst 1 dag denna vecka',
          'Undvik bilen för korta vardagsresor när det går',
        ],
        tips: [
          'Börja med en dag, inte hela veckan direkt.',
          'Se till att du har gott om tid',
          'Notera hur mycket pengar du sparade på färre bilresor',
        ],
      },
      {
        title: 'Andra veckan',
        description: 'Bygg vidare och gör cyklingen mer naturlig i vardagen.',
        xpReward: 100,
        subtasks: [
          'Cykla till destinationen minst 2 dagar denna vecka',
          'Undvik bilen för korta vardagsresor när det går',
        ],
        tips: [
          'Lägg fram allt du behöver kvällen innan.',
          'Fokusera på vanan, inte på hastigheten.',
        ],
      },
      {
        title: 'Tredje veckan',
        description: 'Fortsätt minska bilresorna och stärk rutinen.',
        xpReward: 100,
        subtasks: [
          'Cykla till destinationen minst 4 dagar denna vecka',
          'Undvik bilen för korta vardagsresor när det går',
        ],
        tips: [
          'Påminn dig om både ekonomin och hälsovinsten.',
          'Ha en reservplan för dåligt väder.'
        ],
      },
      {
        title: 'Första månaden som cykelpendlare',
        description: 'Gör cykeln till ett naturligt alternativ i vardagen.',
        xpReward: 250,
        subtasks: [
          'Cykla till destinationen varje dag denna vecka',
          'Undvik bilen för korta vardagsresor när det går',
        ],
        tips: [
          'Du har snart klarat en hel månad, fortsätt så!',
          'Fira dina framsteg och påminn dig om varför du gör detta'
        ],
      },
    ],
  },
 
];
