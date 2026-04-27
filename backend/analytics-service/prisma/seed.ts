import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.weeklyStatCard.findFirst({
    where: { userId: 'demo-auth-user-1' },
  });

  if (existing) {
    return;
  }

  await prisma.weeklyStatCard.createMany({
    data: [
      {
        userId: 'demo-auth-user-1',
        icon: 'checkmark-circle-outline',
        value: '24',
        label: 'Tasks klara',
        detail: '+12 % från förra veckan',
        color: '#A866FF',
        position: 0,
      },
      {
        userId: 'demo-auth-user-1',
        icon: 'star-outline',
        value: '3 240',
        label: 'XP denna vecka',
        detail: '+18 % från förra veckan',
        color: '#F5C13C',
        position: 1,
      },
      {
        userId: 'demo-auth-user-1',
        icon: 'radio-button-on-outline',
        value: '88 %',
        label: 'Måluppfyllelse',
        detail: '+9 % från förra veckan',
        color: '#67D86F',
        position: 2,
      },
      {
        userId: 'demo-auth-user-1',
        icon: 'flame-outline',
        value: '12',
        label: 'Dagar i streak',
        detail: 'Bästa: 12 dagar',
        color: '#FF8A3C',
        position: 3,
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
