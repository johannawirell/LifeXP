import type { GoalTemplateSeed } from './template-seed-types';

export const relationshipGoalTemplates: GoalTemplateSeed[] = [
  {
    title: 'Stärka relationen med partnern',
    icon: 'heart-outline',
    subtitle: 'Relationer',
    summaryDescription: 'Skapa mer kvalitetstid, bättre kommunikation och tydliga vanor tillsammans.',
    detailDescription:
      'Målet hjälper er att sätta ord på vad ni vill förbättra, planera kvalitetstid och skapa mer hållbara vanor tillsammans.',
    category: 'RELATIONSHIP',
    color: '#FF77C8',
    isPopular: true,
    details: [
      { label: 'Kategori', value: 'Relationer', visibility: 'SUMMARY' },
      { label: 'Fokusområde', value: 'Partnerrelation', visibility: 'SUMMARY' },
      { label: 'Fokus', value: 'Kommunikation, kvalitetstid och gemensamma rutiner', visibility: 'DETAIL' },
      { label: 'Passar dig som', value: 'vill investera mer aktivt i er relation', visibility: 'DETAIL' },
    ],
    milestones: [
      { title: 'Prata om vad ni båda vill förbättra' },
      { title: 'Planera in regelbunden kvalitetstid' },
      { title: 'Skapa bättre vanor för kommunikation' },
      { title: 'Följ upp hur det känns efter två veckor' },
      { title: 'Justera gemensamma rutiner' },
    ],
  },
  {
    title: 'Utöka mitt sociala nätverk',
    icon: 'people-outline',
    subtitle: 'Relationer',
    summaryDescription: 'Bygg fler meningsfulla relationer i vardagen.',
    detailDescription:
      'Det här målet bryter ner social utveckling i små steg så att du enklare kan skapa nya kontakter och följa upp dem.',
    category: 'RELATIONSHIP',
    color: '#7A8CFF',
    isPopular: false,
    details: [
      { label: 'Kategori', value: 'Relationer', visibility: 'SUMMARY' },
      { label: 'Fokusområde', value: 'Nya sociala kontakter', visibility: 'SUMMARY' },
      { label: 'Fokus', value: 'Initiativ, uppföljning och återkommande social vana', visibility: 'DETAIL' },
      { label: 'Passar dig som', value: 'vill bredda ditt nätverk eller skapa fler relationer', visibility: 'DETAIL' },
    ],
    milestones: [
      { title: 'Identifiera sammanhang där du kan träffa nya personer' },
      { title: 'Ta initiativ till en ny social aktivitet' },
      { title: 'Håll kontakt med minst två nya personer' },
      { title: 'Boka in en uppföljande träff eller fika' },
      { title: 'Bygg en återkommande social rutin' },
    ],
  },
];
