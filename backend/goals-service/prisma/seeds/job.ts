import type { GoalTemplateSeed } from './template-seed-types';

export const jobGoalTemplates: GoalTemplateSeed[] = [
  {
    title: 'Bli redo för en befordran',
    icon: 'briefcase-outline',
    subtitle: 'Jobb',
    summaryDescription: 'Utveckla dina skills och ta nästa steg i karriären.',
    detailDescription:
      'Det här målet hjälper dig att bli tydligare i vilken roll du siktar på, vilka kompetenser som behöver stärkas och hur du vågar ta nästa steg.',
    category: 'JOB',
    color: '#5E8BFF',
    isPopular: true,
    details: [
      { label: 'Kategori', value: 'Jobb', visibility: 'SUMMARY' },
      { label: 'Upplägg', value: 'utvecklingssteg', visibility: 'SUMMARY' },
      { label: 'Fokus', value: 'Karriär, utveckling', visibility: 'DETAIL' }
    ],
    milestones: [
      {
        title: 'Definiera rollen du vill nå',
        subtasks: ['Skriv ner vilken roll du siktar på', 'Lista varför den rollen passar dig', 'Välj 2-3 krav från jobbannonser'],
        tips: ['Utgå från riktiga jobbannonser.', 'Jämför gärna flera roller innan du bestämmer dig.'],
      },
      {
        title: 'Utveckla saknade kompetenser',
        subtasks: ['Välj kompetenser att stärka', 'Hitta kurs, bok eller träning', 'Sätt en veckoplan för lärandet'],
        tips: ['Fokusera på det som ger störst effekt först.', 'Undvik att försöka lära dig allt samtidigt.'],
      },
      {
        title: 'Visa initiativ',
        subtasks: ['Ta ansvar för en uppgift', 'Föreslå en förbättring', 'Följ upp resultatet med teamet'],
        tips: ['Välj något synligt men realistiskt.', 'Dokumentera vad du själv drev framåt.'],
      },
      {
        title: 'Dokumentera dina framsteg',
        subtasks: ['Skriv ner konkreta resultat', 'Samla feedback och leveranser', 'Formulera vad du bidrog med'],
        tips: ['Använd siffror när det går.', 'Skriv löpande i stället för att försöka minnas allt senare.'],
      },
      {
        title: 'Be om feedback',
        subtasks: ['Välj rätt person att fråga', 'Be om konkret feedback', 'Skriv ner vad du ska förbättra'],
        tips: ['Be om specifik feedback, inte allmän.', 'Fråga både om styrkor och utvecklingsområden.'],
      },
      {
        title: 'Be om ett utvecklingssamtal',
        subtasks: ['Boka möte med chef', 'Förbered vad du vill ta upp', 'Koppla samtalet till din utveckling'],
        tips: ['Var tydlig med syftet med mötet.', 'Skicka gärna några punkter i förväg.'],
      },
      {
        title: 'Ta samtalet',
        subtasks: ['Beskriv målet med din utveckling', 'Visa vad du redan gjort', 'Be om nästa konkreta steg'],
        tips: ['Håll fokus på framtiden och nästa steg.', 'Avsluta med en tydlig uppföljning.'],
      },
    ],
  },
  {
    title: 'Byta jobb',
    icon: 'briefcase-outline',
    subtitle: 'Jobb',
    summaryDescription: 'Bygg en konkret plan för att hitta och landa ett nytt jobb.',
    detailDescription: 'Byt riktning och satsa på något som passar dig bättre. Börja idag och bygg momentum steg för steg.',
    category: 'JOB',
    color: '#5E8BFF',
    isPopular: false,
    details: [
      { label: 'Kategori', value: 'Jobb', visibility: 'SUMMARY' },
      { label: 'Tidsram', value: '6 månader', visibility: 'SUMMARY' },
      { label: 'Fokus', value: 'CV, ansökningar och intervjuträning', visibility: 'DETAIL' },
      { label: 'Passar dig som', value: 'vill byta roll, bransch eller arbetsgivare', visibility: 'DETAIL' },
    ],
    milestones: [
      {
        title: 'Bestäm vilken typ av roller du söker',
        subtasks: ['Definiera roll, nivå och bransch', 'Skriv ner vad du inte vill ha', 'Välj 10 relevanta företag'],
        tips: ['Var hellre tydlig än för bred.', 'Utgå från vad du faktiskt vill motiveras av.'],
      },
      {
        title: 'Uppdatera CV och LinkedIn',
        subtasks: ['Skriv om sammanfattningen', 'Lyft resultat i erfarenheter', 'Uppdatera rubrik och profilbild'],
        tips: ['Anpassa rubriken mot den roll du söker.', 'Fokusera på resultat, inte bara ansvar.'],
      },
      {
        title: 'Sök ett visst antal jobb varje vecka',
        subtasks: ['Sätt ett veckomål', 'Blocka tid i kalendern', 'Följ upp hur många ansökningar du skickat'],
        tips: ['Hellre jämn takt än intensiva ryck.', 'Skriv upp vilka ansökningar som är viktigast.'],
      },
      {
        title: 'Öva på intervjufrågor',
        subtasks: ['Välj vanliga frågor', 'Skriv stödord till svaren', 'Öva högt med timer'],
        tips: ['Öva på konkreta exempel.', 'Spela gärna in dig själv när du tränar.'],
      },
      {
        title: 'Genomför och följ upp intervjuer',
        subtasks: ['Anteckna direkt efter intervjun', 'Skicka uppföljning vid behov', 'Justera svaren inför nästa intervju'],
        tips: ['Reflektera direkt medan allt är färskt.', 'Se varje intervju som träning, inte bara utvärdering.'],
      },
    ],
  },
];
