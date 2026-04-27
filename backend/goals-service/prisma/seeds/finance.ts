import type { GoalTemplateSeed } from './template-seed-types';

export const financeGoalTemplates: GoalTemplateSeed[] = [
  {
    title: 'Bygg en buffert',
    icon: 'wallet-outline',
    subtitle: 'Ekonomi',
    summaryDescription: 'Spara ihop en trygg ekonomisk buffert steg för steg.',
    detailDescription:
      'Det här målet hjälper dig att skapa ett stabilare ekonomiskt läge genom att bygga upp en buffert med tydliga sparsteg.',
    category: 'FINANCE',
    color: '#56D2C5',
    isPopular: true,
    details: [
      { label: 'Kategori', value: 'Ekonomi', visibility: 'SUMMARY' },
      { label: 'Upplägg', value: 'utvecklingssteg', visibility: 'SUMMARY' },
      { label: 'Fokus', value: 'Sparande och trygghet', visibility: 'SUMMARY' },
      { label: 'Passar dig som', value: 'vill få mer kontroll över oväntade utgifter', visibility: 'DETAIL' },
      { label: 'Metod', value: 'Kartläggning, budget och löpande sparmål', visibility: 'DETAIL' },
    ],
    milestones: [
      { title: 'Räkna ut hur stor buffert du vill ha' },
      { title: 'Gå igenom fasta och rörliga utgifter' },
      { title: 'Sätt upp ett separat buffertsparande' },
      { title: 'Automatisera en månadsöverföring' },
      { title: 'Följ upp bufferten varje månad' },
    ],
  },
  {
    title: 'Betala av skulder',
    icon: 'card-outline',
    subtitle: 'Ekonomi',
    summaryDescription: 'Skapa en konkret plan för att minska och bli fri från skulder.',
    detailDescription:
      'Målet bryter ner skuldsanering i tydliga steg så att du kan prioritera rätt, få överblick och följa avbetalningen löpande.',
    category: 'FINANCE',
    color: '#56D2C5',
    isPopular: false,
    details: [
      { label: 'Kategori', value: 'Ekonomi', visibility: 'SUMMARY' },
      { label: 'Upplägg', value: 'utvecklingssteg', visibility: 'SUMMARY' },
      { label: 'Fokus', value: 'Avbetalning och överblick', visibility: 'SUMMARY' },
      { label: 'Passar dig som', value: 'vill få kontroll över lån, krediter eller andra skulder', visibility: 'DETAIL' },
      { label: 'Metod', value: 'Skuldlista, prioritering och uppföljning', visibility: 'DETAIL' },
    ],
    milestones: [
      { title: 'Lista alla skulder och räntor' },
      { title: 'Välj avbetalningsstrategi' },
      { title: 'Sätt en realistisk månadsbudget' },
      { title: 'Betala extra på den prioriterade skulden' },
      { title: 'Följ upp framsteg varje månad' },
    ],
  },
];
