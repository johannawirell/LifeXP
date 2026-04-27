import { PrismaClient } from '@prisma/client';

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
      currentLevel: 12,
      totalXp: 2450,
      nextLevelXp: 3000,
      settings: {
        create: {
          theme: 'dark',
          notificationsEnabled: true,
          weeklySummaryEnabled: true,
          marketingEnabled: false,
        },
      },
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
      activeGoals: {
        create: [
          {
            icon: 'walk-outline',
            title: 'Springa 5 km',
            subtitle: 'steg 3 av 4',
            progress: 0.6,
            color: '#73D86A',
            percentLabel: '60 %',
            position: 0,
          },
          {
            icon: 'school-outline',
            title: 'Klara kursen i Matematik 2',
            subtitle: 'steg 2 av 5',
            progress: 0.4,
            color: '#B269FF',
            percentLabel: '40 %',
            position: 1,
          },
          {
            icon: 'ban-outline',
            title: 'Sluta med alkohol',
            subtitle: '12 dagar i rad',
            progress: 0.8,
            color: '#F08A45',
            percentLabel: '80 %',
            position: 2,
          },
        ],
      },
      achievements: {
        create: [
          {
            icon: 'flame-outline',
            title: '7 dagars streak',
            subtitle: '2+ gånger',
            color: '#FF8A3C',
            position: 0,
          },
          {
            icon: 'trophy-outline',
            title: 'Fokusmästare',
            subtitle: 'Uppnått Level 10 i Fokus',
            color: '#F5C13C',
            position: 1,
          },
          {
            icon: 'locate-outline',
            title: 'Måljägare',
            subtitle: 'Slutfört 5 mål',
            color: '#67D86F',
            position: 2,
          },
          {
            icon: 'fitness-outline',
            title: 'Disciplinerad',
            subtitle: '30 dagars streak',
            color: '#62A5FF',
            position: 3,
          },
          {
            icon: 'person-outline',
            title: 'Lugn i sinnet',
            subtitle: '10 dagar meditation',
            color: '#A866FF',
            position: 4,
          },
        ],
      },
      weeklyStats: {
        create: [
          {
            icon: 'checkmark-circle-outline',
            value: '24',
            label: 'Tasks klara',
            detail: '+12 % från förra veckan',
            color: '#A866FF',
            position: 0,
          },
          {
            icon: 'star-outline',
            value: '3 240',
            label: 'XP denna vecka',
            detail: '+18 % från förra veckan',
            color: '#F5C13C',
            position: 1,
          },
          {
            icon: 'radio-button-on-outline',
            value: '88 %',
            label: 'Måluppfyllelse',
            detail: '+9 % från förra veckan',
            color: '#67D86F',
            position: 2,
          },
          {
            icon: 'flame-outline',
            value: '12',
            label: 'Dagar i streak',
            detail: 'Bästa: 12 dagar',
            color: '#FF8A3C',
            position: 3,
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
