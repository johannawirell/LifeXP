import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

async function main() {
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
        category: 'Träning',
        color: '#73D86A',
        isPopular: true,
        position: 0,
      },
      {
        title: 'Klara en kurs',
        icon: 'school-outline',
        subtitle: 'Plugg',
        description: 'Följ en plan och klara din kurs med bra resultat.',
        category: 'Plugg',
        color: '#B269FF',
        isPopular: true,
        position: 1,
      },
      {
        title: 'Sluta med alkohol',
        icon: 'ban-outline',
        subtitle: 'Hälsa',
        description: 'Bygg nya vanor och bli helt fri från alkohol.',
        category: 'Hälsa',
        color: '#F08A45',
        isPopular: true,
        position: 2,
      },
      {
        title: 'Bli redo för en befordran',
        icon: 'briefcase-outline',
        subtitle: 'Jobb',
        description: 'Utveckla dina skills och ta nästa steg i karriären.',
        category: 'Jobb',
        color: '#5E8BFF',
        isPopular: true,
        position: 3,
      },
      {
        title: 'Bygga muskler',
        icon: 'barbell-outline',
        subtitle: 'Träning',
        description: 'Träna regelbundet och bygg styrka över tid.',
        category: 'Träning',
        color: '#F5C13C',
        isPopular: true,
        position: 4,
      },
      {
        title: 'Minska stress',
        icon: 'leaf-outline',
        subtitle: 'Hälsa',
        description: 'Skapa lugn i vardagen och må bättre mentalt.',
        category: 'Hälsa',
        color: '#67D86F',
        isPopular: true,
        position: 5,
      },
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
