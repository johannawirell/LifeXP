import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.userGamification.findUnique({
    where: { userId: 'demo-auth-user-1' },
  });

  if (existing) {
    return;
  }

  await prisma.userGamification.create({
    data: {
      userId: 'demo-auth-user-1',
      totalXp: 2450,
      currentLevel: 12,
      currentStreak: 12,
      bestStreak: 12,
      nextLevelXp: 3000,
      headline: 'Fokuserad • Disciplinerad • På väg upp',
      focusAreas: {
        create: [
          {
            icon: 'locate-outline',
            title: 'Fokus',
            level: 14,
            currentXp: 1250,
            maxXp: 2000,
            color: '#5E8BFF',
            position: 0,
          },
          {
            icon: 'flash-outline',
            title: 'Energi',
            level: 11,
            currentXp: 980,
            maxXp: 1800,
            color: '#F5B333',
            position: 1,
          },
          {
            icon: 'shield-checkmark-outline',
            title: 'Disciplin',
            level: 13,
            currentXp: 1600,
            maxXp: 2200,
            color: '#67D86F',
            position: 2,
          },
          {
            icon: 'leaf-outline',
            title: 'Balans',
            level: 10,
            currentXp: 700,
            maxXp: 1600,
            color: '#A866FF',
            position: 3,
          },
        ],
      },
      achievements: {
        create: [
          {
            subtitle: '2+ gånger',
            color: '#FF8A3C',
            icon: 'flame-outline',
            position: 0,
            achievementDefinition: {
              create: {
                code: 'seven-day-streak',
                title: '7 dagars streak',
                description: '2+ gånger',
              },
            },
          },
          {
            subtitle: 'Uppnått Level 10 i Fokus',
            color: '#F5C13C',
            icon: 'trophy-outline',
            position: 1,
            achievementDefinition: {
              create: {
                code: 'focus-master',
                title: 'Fokusmästare',
                description: 'Uppnått Level 10 i Fokus',
              },
            },
          },
          {
            subtitle: 'Slutfört 5 mål',
            color: '#67D86F',
            icon: 'locate-outline',
            position: 2,
            achievementDefinition: {
              create: {
                code: 'goal-hunter',
                title: 'Måljägare',
                description: 'Slutfört 5 mål',
              },
            },
          },
          {
            subtitle: '30 dagars streak',
            color: '#62A5FF',
            icon: 'fitness-outline',
            position: 3,
            achievementDefinition: {
              create: {
                code: 'disciplined',
                title: 'Disciplinerad',
                description: '30 dagars streak',
              },
            },
          },
          {
            subtitle: '10 dagar meditation',
            color: '#A866FF',
            icon: 'person-outline',
            position: 4,
            achievementDefinition: {
              create: {
                code: 'calm-mind',
                title: 'Lugn i sinnet',
                description: '10 dagar meditation',
              },
            },
          },
        ],
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
