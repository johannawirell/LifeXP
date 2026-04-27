import type { GoalTemplateSeed } from './template-seed-types';

export const healthGoalTemplates: GoalTemplateSeed[] = [
  {
    title: 'Sluta med alkohol',
    icon: 'ban-outline',
    subtitle: 'Hälsa',
    summaryDescription: 'Bygg nya vanor och bli helt fri från alkohol.',
    detailDescription:
      'Målet hjälper dig att identifiera triggers, skapa nya rutiner och bygga upp ett hållbart alkoholfritt vardagsmönster.',
    category: 'HEALTH',
    color: '#F08A45',
    isPopular: true,
    details: [
      { label: 'Kategori', value: 'Hälsa', visibility: 'SUMMARY' },
      { label: 'Upplägg', value: 'Vanebrytande steg', visibility: 'SUMMARY' },
      { label: 'Fokus', value: 'Triggers, planering och nyktra rutiner', visibility: 'DETAIL' },
      { label: 'Passar dig som', value: 'vill skapa en tydlig plan för att bli alkoholfri', visibility: 'DETAIL' },
    ],
    milestones: [
      { title: 'Identifiera triggers och risksituationer' },
      { title: 'Skapa en plan för helger och sociala tillfällen' },
      { title: 'Byt ut alkohol mot nya vanor' },
      { title: 'Logga nyktra dagar' },
      { title: 'Nå första 30 dagarna alkoholfri' },
    ],
  },
  {
    title: 'Minska stress',
    icon: 'leaf-outline',
    subtitle: 'Hälsa',
    summaryDescription: 'Skapa lugn i vardagen och må bättre mentalt.',
    detailDescription:
      'Målet ger dig en enkel struktur för att förstå vad som dränerar dig och bygga in återhämtning och lugnare rutiner.',
    category: 'HEALTH',
    color: '#67D86F',
    isPopular: true,
    details: [
      { label: 'Kategori', value: 'Hälsa', visibility: 'SUMMARY' },
      { label: 'Fokusområde', value: 'Stress och återhämtning', visibility: 'SUMMARY' },
      { label: 'Fokus', value: 'Rutiner, återhämtning och belastning', visibility: 'DETAIL' },
      { label: 'Passar dig som', value: 'vill få bättre balans i vardagen', visibility: 'DETAIL' },
    ],
    milestones: [
      { title: 'Kartlägg vad som stressar dig mest' },
      { title: 'Skapa en lugn morgon- eller kvällsrutin' },
      { title: 'Avsätt tid för återhämtning varje dag' },
      { title: 'Minska en onödig belastning i veckan' },
      { title: 'Utvärdera energinivå och sömn efter 2 veckor' },
    ],
  },
  {
    title: 'Gå ner 5 kg',
    icon: 'fitness-outline',
    subtitle: 'Hälsa',
    summaryDescription: 'Skapa hållbara vanor kring kost, rörelse och återhämtning.',
    detailDescription:
      'Det här målet fokuserar på hållbara livsstilsförändringar snarare än snabba lösningar, med tydliga steg för kost och rörelse.',
    category: 'HEALTH',
    color: '#F08A45',
    isPopular: false,
    details: [
      { label: 'Kategori', value: 'Hälsa', visibility: 'SUMMARY' },
      { label: 'Målnivå', value: '5 kg', visibility: 'SUMMARY' },
      { label: 'Fokus', value: 'Kost, aktivitet och veckovis uppföljning', visibility: 'DETAIL' },
      { label: 'Passar dig som', value: 'vill gå ner i vikt med hållbara vanor', visibility: 'DETAIL' },
    ],
    milestones: [
      { title: 'Sätt ett realistiskt kalori- och aktivitetsmål' },
      { title: 'Planera måltider för veckan' },
      { title: 'Rör dig minst 30 minuter om dagen' },
      { title: 'Följ upp vikt och mått varje vecka' },
      { title: 'Justera planen efter första månaden' },
    ],
  },
];
