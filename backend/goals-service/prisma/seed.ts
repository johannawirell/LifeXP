import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.goal.findFirst({
    where: { userId: 'demo-auth-user-1' },
  });

  if (existing) {
    return;
  }

  await prisma.goal.createMany({
    data: [
      {
        userId: 'demo-auth-user-1',
        title: 'Springa 5 km',
        description: 'steg 3 av 4',
        icon: 'walk-outline',
        status: 'ACTIVE',
        targetValue: 100,
        currentValue: 60,
        percentLabel: '60 %',
        cardColor: '#73D86A',
      },
      {
        userId: 'demo-auth-user-1',
        title: 'Klara kursen i Matematik 2',
        description: 'steg 2 av 5',
        icon: 'school-outline',
        status: 'ACTIVE',
        targetValue: 100,
        currentValue: 40,
        percentLabel: '40 %',
        cardColor: '#B269FF',
      },
      {
        userId: 'demo-auth-user-1',
        title: 'Sluta med alkohol',
        description: '12 dagar i rad',
        icon: 'ban-outline',
        status: 'ACTIVE',
        targetValue: 100,
        currentValue: 80,
        percentLabel: '80 %',
        cardColor: '#F08A45',
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
