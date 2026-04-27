import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.goalTemplateMilestone.deleteMany();
  await prisma.goalTemplate.deleteMany();
  await prisma.milestone.deleteMany({
    where: {
      goal: {
        userId: 'demo-auth-user-1',
      },
    },
  });

  await prisma.goal.deleteMany({
    where: { userId: 'demo-auth-user-1' },
  });

  await prisma.goal.createMany({
    data: [
      {
        userId: 'demo-auth-user-1',
        title: 'Springa 5 km',
        subtitle: 'Träning',
        icon: 'walk-outline',
        status: 'ACTIVE',
        targetValue: 5,
        currentValue: 3,
        percentLabel: '60 %',
        cardColor: '#73D86A',
      },
      {
        userId: 'demo-auth-user-1',
        title: 'Klara kursen i Matematik 2',
        subtitle: 'Plugg',
        icon: 'school-outline',
        status: 'ACTIVE',
        targetValue: 5,
        currentValue: 2,
        percentLabel: '40 %',
        cardColor: '#B269FF',
      },
      {
        userId: 'demo-auth-user-1',
        title: 'Sluta med alkohol',
        subtitle: 'Hälsa',
        icon: 'ban-outline',
        status: 'ACTIVE',
        targetValue: 10,
        currentValue: 8,
        unit: 'days',
        percentLabel: '80 %',
        cardColor: '#F08A45',
        streakDays: 7,
      },
      {
        userId: 'demo-auth-user-1',
        title: 'Meditera varje dag',
        subtitle: 'Balans',
        icon: 'leaf-outline',
        status: 'COMPLETED',
        targetValue: 7,
        currentValue: 7,
        percentLabel: '100 %',
        cardColor: '#5E8BFF',
      },
    ],
  });

  const runGoal = await prisma.goal.findFirstOrThrow({
    where: { userId: 'demo-auth-user-1', title: 'Springa 5 km' },
  });
  const mathGoal = await prisma.goal.findFirstOrThrow({
    where: { userId: 'demo-auth-user-1', title: 'Klara kursen i Matematik 2' },
  });
  const alcoholGoal = await prisma.goal.findFirstOrThrow({
    where: { userId: 'demo-auth-user-1', title: 'Sluta med alkohol' },
  });
  const meditationGoal = await prisma.goal.findFirstOrThrow({
    where: { userId: 'demo-auth-user-1', title: 'Meditera varje dag' },
  });

  await prisma.milestone.createMany({
    data: [
      {
        goalId: runGoal.id,
        title: 'Springa 1 km',
        completedAt: new Date('2026-05-12'),
        position: 0,
      },
      {
        goalId: runGoal.id,
        title: 'Springa 2 km',
        completedAt: new Date('2026-05-18'),
        position: 1,
      },
      {
        goalId: runGoal.id,
        title: 'Springa 3 km',
        completedAt: new Date('2026-05-24'),
        position: 2,
      },
      {
        goalId: runGoal.id,
        title: 'Springa 4 km',
        position: 3,
      },
      {
        goalId: runGoal.id,
        title: 'Springa 5 km',
        position: 4,
      },
      {
        goalId: mathGoal.id,
        title: 'Skapa studieplan',
        completedAt: new Date('2026-05-10'),
        position: 0,
      },
      {
        goalId: mathGoal.id,
        title: 'Gå igenom kapitel 1–2',
        completedAt: new Date('2026-05-16'),
        position: 1,
      },
      {
        goalId: mathGoal.id,
        title: 'Göra uppgifter',
        position: 2,
      },
      {
        goalId: mathGoal.id,
        title: 'Repetera inför tenta',
        position: 3,
      },
      {
        goalId: mathGoal.id,
        title: 'Klara tentan',
        position: 4,
      },
      {
        goalId: alcoholGoal.id,
        title: 'Dag 1',
        completedAt: new Date('2026-05-01'),
        position: 0,
      },
      {
        goalId: alcoholGoal.id,
        title: 'Dag 3',
        completedAt: new Date('2026-05-03'),
        position: 1,
      },
      {
        goalId: alcoholGoal.id,
        title: 'Dag 7',
        completedAt: new Date('2026-05-07'),
        position: 2,
      },
      {
        goalId: alcoholGoal.id,
        title: 'Dag 10',
        completedAt: new Date('2026-05-10'),
        position: 3,
      },
      {
        goalId: alcoholGoal.id,
        title: 'Dag 14',
        position: 4,
      },
      {
        goalId: meditationGoal.id,
        title: 'Dag 1',
        completedAt: new Date('2026-04-01'),
        position: 0,
      },
      {
        goalId: meditationGoal.id,
        title: 'Dag 2',
        completedAt: new Date('2026-04-02'),
        position: 1,
      },
      {
        goalId: meditationGoal.id,
        title: 'Dag 3',
        completedAt: new Date('2026-04-03'),
        position: 2,
      },
      {
        goalId: meditationGoal.id,
        title: 'Dag 4',
        completedAt: new Date('2026-04-04'),
        position: 3,
      },
      {
        goalId: meditationGoal.id,
        title: 'Dag 5',
        completedAt: new Date('2026-04-05'),
        position: 4,
      },
      {
        goalId: meditationGoal.id,
        title: 'Dag 6',
        completedAt: new Date('2026-04-06'),
        position: 5,
      },
      {
        goalId: meditationGoal.id,
        title: 'Dag 7',
        completedAt: new Date('2026-04-07'),
        position: 6,
      },
    ],
  });

  await prisma.goalTemplate.createMany({
    data: [
      {
        title: 'Springa 5 km',
        icon: 'walk-outline',
        subtitle: 'Träning',
        description: 'Bygg upp din kondition och spring 5 km utan att stanna.',
        category: 'TRAINING',
        color: '#73D86A',
        isPopular: true,
        position: 0,
      },
      {
        title: 'Klara en kurs',
        icon: 'school-outline',
        subtitle: 'Plugg',
        description: 'Följ en plan och klara din kurs med bra resultat.',
        category: 'STUDY',
        color: '#B269FF',
        isPopular: true,
        position: 1,
      },
      {
        title: 'Sluta med alkohol',
        icon: 'ban-outline',
        subtitle: 'Hälsa',
        description: 'Bygg nya vanor och bli helt fri från alkohol.',
        category: 'HEALTH',
        color: '#F08A45',
        isPopular: true,
        position: 2,
      },
      {
        title: 'Bli redo för en befordran',
        icon: 'briefcase-outline',
        subtitle: 'Jobb',
        description: 'Utveckla dina skills och ta nästa steg i karriären.',
        category: 'JOB',
        color: '#5E8BFF',
        isPopular: true,
        position: 3,
      },
      {
        title: 'Bygga muskler',
        icon: 'barbell-outline',
        subtitle: 'Träning',
        description: 'Träna regelbundet och bygg styrka över tid.',
        category: 'TRAINING',
        color: '#F5C13C',
        isPopular: true,
        position: 4,
      },
      {
        title: 'Minska stress',
        icon: 'leaf-outline',
        subtitle: 'Hälsa',
        description: 'Skapa lugn i vardagen och må bättre mentalt.',
        category: 'HEALTH',
        color: '#67D86F',
        isPopular: true,
        position: 5,
      },
      {
        title: 'Byta jobb inom 6 månader',
        icon: 'briefcase-outline',
        subtitle: 'Jobb',
        description: 'Bygg en konkret plan för att hitta och landa ett nytt jobb.',
        category: 'JOB',
        color: '#5E8BFF',
        isPopular: false,
        position: 6,
      },
      {
        title: 'Ta examen i tid',
        icon: 'school-outline',
        subtitle: 'Plugg',
        description: 'Planera dina studier så att du klarar alla moment innan examen.',
        category: 'STUDY',
        color: '#B269FF',
        isPopular: false,
        position: 7,
      },
      {
        title: 'Gå ner 5 kg',
        icon: 'fitness-outline',
        subtitle: 'Hälsa',
        description: 'Skapa hållbara vanor kring kost, rörelse och återhämtning.',
        category: 'HEALTH',
        color: '#F08A45',
        isPopular: false,
        position: 8,
      },
      {
        title: 'Springa halvmaraton',
        icon: 'walk-outline',
        subtitle: 'Träning',
        description: 'Träna stegvis för att kunna genomföra ett halvmaraton.',
        category: 'TRAINING',
        color: '#73D86A',
        isPopular: false,
        position: 9,
      },
      {
        title: 'Stärka relationen med partnern',
        icon: 'heart-outline',
        subtitle: 'Relationer',
        description: 'Skapa mer kvalitetstid, bättre kommunikation och tydliga vanor tillsammans.',
        category: 'RELATIONSHIP',
        color: '#FF77C8',
        isPopular: true,
        position: 10,
      },
      {
        title: 'Utöka mitt sociala nätverk',
        icon: 'people-outline',
        subtitle: 'Relationer',
        description: 'Bygg fler meningsfulla relationer i vardagen.',
        category: 'RELATIONSHIP',
        color: '#7A8CFF',
        isPopular: false,
        position: 11,
      },
    ],
  });

  const templates = await prisma.goalTemplate.findMany();
  const byTitle = Object.fromEntries(templates.map((template) => [template.title, template.id]));

  await prisma.goalTemplateMilestone.createMany({
    data: [
      { goalTemplateId: byTitle['Springa 5 km'], title: 'Spring 1 km utan paus', position: 0 },
      { goalTemplateId: byTitle['Springa 5 km'], title: 'Spring 2 km i lugnt tempo', position: 1 },
      { goalTemplateId: byTitle['Springa 5 km'], title: 'Spring 3 km sammanhängande', position: 2 },
      { goalTemplateId: byTitle['Springa 5 km'], title: 'Spring 4 km med jämnt tempo', position: 3 },
      { goalTemplateId: byTitle['Springa 5 km'], title: 'Spring 5 km utan att stanna', position: 4 },

      { goalTemplateId: byTitle['Klara en kurs'], title: 'Gör en studieplan för kursen', position: 0 },
      { goalTemplateId: byTitle['Klara en kurs'], title: 'Dela upp kursen i veckomål', position: 1 },
      { goalTemplateId: byTitle['Klara en kurs'], title: 'Gör alla inlämningar i tid', position: 2 },
      { goalTemplateId: byTitle['Klara en kurs'], title: 'Repetera inför examination', position: 3 },
      { goalTemplateId: byTitle['Klara en kurs'], title: 'Genomför tentan eller slutuppgiften', position: 4 },

      { goalTemplateId: byTitle['Sluta med alkohol'], title: 'Identifiera triggers och risksituationer', position: 0 },
      { goalTemplateId: byTitle['Sluta med alkohol'], title: 'Skapa en plan för helger och sociala tillfällen', position: 1 },
      { goalTemplateId: byTitle['Sluta med alkohol'], title: 'Byt ut alkohol mot nya vanor', position: 2 },
      { goalTemplateId: byTitle['Sluta med alkohol'], title: 'Logga nyktra dagar', position: 3 },
      { goalTemplateId: byTitle['Sluta med alkohol'], title: 'Nå första 30 dagarna alkoholfri', position: 4 },

      { goalTemplateId: byTitle['Bli redo för en befordran'], title: 'Definiera rollen du vill ta nästa steg mot', position: 0 },
      { goalTemplateId: byTitle['Bli redo för en befordran'], title: 'Identifiera vilka skills som saknas', position: 1 },
      { goalTemplateId: byTitle['Bli redo för en befordran'], title: 'Ta ansvar för ett synligt projekt', position: 2 },
      { goalTemplateId: byTitle['Bli redo för en befordran'], title: 'Be om feedback från chef eller mentor', position: 3 },
      { goalTemplateId: byTitle['Bli redo för en befordran'], title: 'Be om ett utvecklingssamtal om nästa steg', position: 4 },

      { goalTemplateId: byTitle['Bygga muskler'], title: 'Skapa ett träningsschema för veckan', position: 0 },
      { goalTemplateId: byTitle['Bygga muskler'], title: 'Sätt mål för kost och proteinintag', position: 1 },
      { goalTemplateId: byTitle['Bygga muskler'], title: 'Träna 3 styrkepass i veckan', position: 2 },
      { goalTemplateId: byTitle['Bygga muskler'], title: 'Öka belastningen gradvis', position: 3 },
      { goalTemplateId: byTitle['Bygga muskler'], title: 'Följ upp styrka och kroppsmått', position: 4 },

      { goalTemplateId: byTitle['Minska stress'], title: 'Kartlägg vad som stressar dig mest', position: 0 },
      { goalTemplateId: byTitle['Minska stress'], title: 'Skapa en lugn morgon- eller kvällsrutin', position: 1 },
      { goalTemplateId: byTitle['Minska stress'], title: 'Avsätt tid för återhämtning varje dag', position: 2 },
      { goalTemplateId: byTitle['Minska stress'], title: 'Minska en onödig belastning i veckan', position: 3 },
      { goalTemplateId: byTitle['Minska stress'], title: 'Utvärdera energinivå och sömn efter 2 veckor', position: 4 },

      { goalTemplateId: byTitle['Byta jobb inom 6 månader'], title: 'Bestäm vilken typ av roller du söker', position: 0 },
      { goalTemplateId: byTitle['Byta jobb inom 6 månader'], title: 'Uppdatera CV och LinkedIn', position: 1 },
      { goalTemplateId: byTitle['Byta jobb inom 6 månader'], title: 'Sök ett visst antal jobb varje vecka', position: 2 },
      { goalTemplateId: byTitle['Byta jobb inom 6 månader'], title: 'Öva på intervjufrågor', position: 3 },
      { goalTemplateId: byTitle['Byta jobb inom 6 månader'], title: 'Genomför och följ upp intervjuer', position: 4 },

      { goalTemplateId: byTitle['Ta examen i tid'], title: 'Lista alla kvarvarande kurser och deadlines', position: 0 },
      { goalTemplateId: byTitle['Ta examen i tid'], title: 'Planera terminen vecka för vecka', position: 1 },
      { goalTemplateId: byTitle['Ta examen i tid'], title: 'Boka studietid i kalendern', position: 2 },
      { goalTemplateId: byTitle['Ta examen i tid'], title: 'Slutför uppgifter i förväg', position: 3 },
      { goalTemplateId: byTitle['Ta examen i tid'], title: 'Följ upp studieplanen varje vecka', position: 4 },

      { goalTemplateId: byTitle['Gå ner 5 kg'], title: 'Sätt ett realistiskt kalori- och aktivitetsmål', position: 0 },
      { goalTemplateId: byTitle['Gå ner 5 kg'], title: 'Planera måltider för veckan', position: 1 },
      { goalTemplateId: byTitle['Gå ner 5 kg'], title: 'Rör dig minst 30 minuter om dagen', position: 2 },
      { goalTemplateId: byTitle['Gå ner 5 kg'], title: 'Följ upp vikt och mått varje vecka', position: 3 },
      { goalTemplateId: byTitle['Gå ner 5 kg'], title: 'Justera planen efter första månaden', position: 4 },

      { goalTemplateId: byTitle['Springa halvmaraton'], title: 'Skapa ett 12-veckors träningsupplägg', position: 0 },
      { goalTemplateId: byTitle['Springa halvmaraton'], title: 'Bygg upp veckovolymen gradvis', position: 1 },
      { goalTemplateId: byTitle['Springa halvmaraton'], title: 'Lägg in ett långpass varje vecka', position: 2 },
      { goalTemplateId: byTitle['Springa halvmaraton'], title: 'Träna tempo och återhämtning', position: 3 },
      { goalTemplateId: byTitle['Springa halvmaraton'], title: 'Genomför loppet', position: 4 },

      { goalTemplateId: byTitle['Stärka relationen med partnern'], title: 'Prata om vad ni båda vill förbättra', position: 0 },
      { goalTemplateId: byTitle['Stärka relationen med partnern'], title: 'Planera in regelbunden kvalitetstid', position: 1 },
      { goalTemplateId: byTitle['Stärka relationen med partnern'], title: 'Skapa bättre vanor för kommunikation', position: 2 },
      { goalTemplateId: byTitle['Stärka relationen med partnern'], title: 'Följ upp hur det känns efter två veckor', position: 3 },
      { goalTemplateId: byTitle['Stärka relationen med partnern'], title: 'Justera gemensamma rutiner', position: 4 },

      { goalTemplateId: byTitle['Utöka mitt sociala nätverk'], title: 'Identifiera sammanhang där du kan träffa nya personer', position: 0 },
      { goalTemplateId: byTitle['Utöka mitt sociala nätverk'], title: 'Ta initiativ till en ny social aktivitet', position: 1 },
      { goalTemplateId: byTitle['Utöka mitt sociala nätverk'], title: 'Håll kontakt med minst två nya personer', position: 2 },
      { goalTemplateId: byTitle['Utöka mitt sociala nätverk'], title: 'Boka in en uppföljande träff eller fika', position: 3 },
      { goalTemplateId: byTitle['Utöka mitt sociala nätverk'], title: 'Bygg en återkommande social rutin', position: 4 },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
