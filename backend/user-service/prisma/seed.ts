import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.userProfile.findFirst();

  if (existing) {
    return;
  }

  await prisma.userProfile.create({
    data: {
      authUserId: 'demo-auth-user-1',
      email: 'alex@example.com',
      displayName: 'Alex',
      firstName: 'Alex',
      locale: 'sv-SE',
      timezone: 'Europe/Stockholm',
      headline: 'Fokuserad • Disciplinerad • På väg upp',
      settings: {
        create: {
          theme: 'dark',
          notificationsEnabled: true,
          weeklySummaryEnabled: true,
          marketingEnabled: false,
        },
      },
    },
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
