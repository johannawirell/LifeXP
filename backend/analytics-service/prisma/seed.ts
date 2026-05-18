import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();
const demoUserId = 'demo-auth-user-1';

async function main() {
  await prisma.activityPoint.deleteMany({ where: { userId: demoUserId } });
  await prisma.categoryProgressSnapshot.deleteMany({ where: { userId: demoUserId } });
  await prisma.statisticsPeriodSnapshot.deleteMany({ where: { userId: demoUserId } });
  await prisma.weeklyStatCard.deleteMany({ where: { userId: demoUserId } });

  await prisma.weeklyStatCard.createMany({
    data: [
      {
        userId: demoUserId,
        icon: 'checkmark-circle-outline',
        value: '24',
        label: 'Quests klara',
        detail: '+12 % från förra veckan',
        color: '#A866FF',
        position: 0,
      },
      {
        userId: demoUserId,
        icon: 'star-outline',
        value: '3 240',
        label: 'Total XP',
        detail: '+18 % från förra veckan',
        color: '#F5C13C',
        position: 1,
      },
      {
        userId: demoUserId,
        icon: 'radio-button-on-outline',
        value: '88 %',
        label: 'Måluppfyllelse',
        detail: '+9 % från förra veckan',
        color: '#67D86F',
        position: 2,
      },
      {
        userId: demoUserId,
        icon: 'flame-outline',
        value: '12',
        label: 'Dagar i streak',
        detail: 'Bästa: 30 dagar',
        color: '#FF8A3C',
        position: 3,
      },
    ],
  });

  await prisma.statisticsPeriodSnapshot.createMany({
    data: [
      {
        userId: demoUserId,
        period: 'DAILY',
        label: 'Idag',
        totalXp: 165,
        completedQuests: 3,
        completedGoals: 0,
        streakDays: 12,
        activityScore: 74,
      },
      {
        userId: demoUserId,
        period: 'WEEKLY',
        label: 'Denna vecka',
        totalXp: 540,
        completedQuests: 12,
        completedGoals: 1,
        streakDays: 12,
        activityScore: 88,
      },
      {
        userId: demoUserId,
        period: 'MONTHLY',
        label: 'Denna månad',
        totalXp: 1480,
        completedQuests: 38,
        completedGoals: 3,
        streakDays: 12,
        activityScore: 81,
      },
    ],
  });

  await prisma.categoryProgressSnapshot.createMany({
    data: [
      { userId: demoUserId, categoryKey: 'TRAINING', label: 'Träning', level: 11, currentXp: 980, nextLevelXp: 1400, color: '#73D86A', position: 0 },
      { userId: demoUserId, categoryKey: 'HEALTH', label: 'Hälsa', level: 10, currentXp: 860, nextLevelXp: 1300, color: '#F08A45', position: 1 },
      { userId: demoUserId, categoryKey: 'PRODUCTIVITY', label: 'Produktivitet', level: 14, currentXp: 1250, nextLevelXp: 1800, color: '#5E8BFF', position: 2 },
      { userId: demoUserId, categoryKey: 'MINDFULNESS', label: 'Mindfulness', level: 9, currentXp: 620, nextLevelXp: 1100, color: '#A866FF', position: 3 },
      { userId: demoUserId, categoryKey: 'CAREER', label: 'Karriär', level: 12, currentXp: 1020, nextLevelXp: 1500, color: '#6DA6FF', position: 4 },
      { userId: demoUserId, categoryKey: 'CREATIVITY', label: 'Kreativitet', level: 7, currentXp: 430, nextLevelXp: 900, color: '#FF77C8', position: 5 },
      { userId: demoUserId, categoryKey: 'SOCIAL', label: 'Socialt', level: 6, currentXp: 380, nextLevelXp: 800, color: '#7A8CFF', position: 6 },
      { userId: demoUserId, categoryKey: 'FINANCE', label: 'Ekonomi', level: 5, currentXp: 320, nextLevelXp: 700, color: '#56D2C5', position: 7 },
    ],
  });

  await prisma.activityPoint.createMany({
    data: [
      { userId: demoUserId, period: 'DAILY', label: 'Mån', value: 80, position: 0 },
      { userId: demoUserId, period: 'DAILY', label: 'Tis', value: 120, position: 1 },
      { userId: demoUserId, period: 'DAILY', label: 'Ons', value: 95, position: 2 },
      { userId: demoUserId, period: 'DAILY', label: 'Tor', value: 140, position: 3 },
      { userId: demoUserId, period: 'DAILY', label: 'Fre', value: 110, position: 4 },
      { userId: demoUserId, period: 'DAILY', label: 'Lör', value: 150, position: 5 },
      { userId: demoUserId, period: 'DAILY', label: 'Sön', value: 165, position: 6 },
      { userId: demoUserId, period: 'WEEKLY', label: 'v.14', value: 420, position: 0 },
      { userId: demoUserId, period: 'WEEKLY', label: 'v.15', value: 510, position: 1 },
      { userId: demoUserId, period: 'WEEKLY', label: 'v.16', value: 605, position: 2 },
      { userId: demoUserId, period: 'WEEKLY', label: 'v.17', value: 540, position: 3 },
      { userId: demoUserId, period: 'MONTHLY', label: 'Feb', value: 980, position: 0 },
      { userId: demoUserId, period: 'MONTHLY', label: 'Mar', value: 1240, position: 1 },
      { userId: demoUserId, period: 'MONTHLY', label: 'Apr', value: 1350, position: 2 },
      { userId: demoUserId, period: 'MONTHLY', label: 'Maj', value: 1480, position: 3 },
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
