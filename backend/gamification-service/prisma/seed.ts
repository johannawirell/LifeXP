import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();
const demoUserId = 'demo-auth-user-1';

async function main() {
  await prisma.userAchievement.deleteMany();
  await prisma.achievementDefinition.deleteMany();
  await prisma.xpEntry.deleteMany();
  await prisma.focusArea.deleteMany();
  await prisma.levelReward.deleteMany();
  await prisma.userGamification.deleteMany({
    where: { userId: demoUserId },
  });

  await prisma.levelReward.createMany({
    data: [
      { level: 2, title: 'Första level up', description: 'Du låste upp din första progression badge.' },
      { level: 5, title: 'Momentum', description: 'Du låste upp en extra rarity-rad i prestationer.' },
      { level: 10, title: 'Veteran', description: 'Du låste upp en ny profilglow för level 10.' },
      { level: 15, title: 'Main character energy', description: 'Din karaktär har nu nått ett tydligt RPG-steg.' },
    ],
  });

  await prisma.userGamification.create({
    data: {
      userId: demoUserId,
      totalXp: 3240,
      currentLevel: 14,
      currentStreak: 12,
      bestStreak: 30,
      nextLevelXp: 3600,
      lastActivityAt: new Date('2026-05-18T08:30:00.000Z'),
      headline: 'Fokuserad • Disciplinerad • Bygger momentum varje dag',
      focusAreas: {
        create: [
          { key: 'TRAINING', icon: 'barbell-outline', title: 'Träning', level: 11, currentXp: 980, maxXp: 1400, color: '#73D86A', position: 0 },
          { key: 'HEALTH', icon: 'heart-outline', title: 'Hälsa', level: 10, currentXp: 860, maxXp: 1300, color: '#F08A45', position: 1 },
          { key: 'PRODUCTIVITY', icon: 'flash-outline', title: 'Produktivitet', level: 14, currentXp: 1250, maxXp: 1800, color: '#5E8BFF', position: 2 },
          { key: 'MINDFULNESS', icon: 'leaf-outline', title: 'Mindfulness', level: 9, currentXp: 620, maxXp: 1100, color: '#A866FF', position: 3 },
          { key: 'CAREER', icon: 'briefcase-outline', title: 'Karriär', level: 12, currentXp: 1020, maxXp: 1500, color: '#6DA6FF', position: 4 },
          { key: 'CREATIVITY', icon: 'color-palette-outline', title: 'Kreativitet', level: 7, currentXp: 430, maxXp: 900, color: '#FF77C8', position: 5 },
          { key: 'SOCIAL', icon: 'people-outline', title: 'Socialt', level: 6, currentXp: 380, maxXp: 800, color: '#7A8CFF', position: 6 },
          { key: 'FINANCE', icon: 'wallet-outline', title: 'Ekonomi', level: 5, currentXp: 320, maxXp: 700, color: '#56D2C5', position: 7 },
        ],
      },
      xpEntries: {
        create: [
          {
            amount: 90,
            sourceType: 'MILESTONE_COMPLETED',
            sourceId: 'demo-run-3km',
            title: 'Spring 3 km sammanhängande',
            description: 'Du klarade tredje steget i ditt 5 km-mål.',
            category: 'TRAINING',
            multiplier: 1.1,
          },
          {
            amount: 100,
            sourceType: 'WEEKLY_QUEST_COMPLETED',
            sourceId: 'demo-side-project',
            title: '5 timmar på sidoprojekt',
            description: 'Veckoquesten gav en tydlig progression på karriärspåret.',
            category: 'CAREER',
            multiplier: 1,
          },
          {
            amount: 25,
            sourceType: 'DAILY_QUEST_COMPLETED',
            sourceId: 'demo-water',
            title: 'Drick 2L vatten',
            description: 'Liten quest, låg tröskel, stadig streak.',
            category: 'HEALTH',
            multiplier: 1,
          },
          {
            amount: 50,
            sourceType: 'STREAK_REWARD',
            sourceId: 'streak-7',
            title: '7 dagars streakbonus',
            description: 'Bonus-XP för att du höll din dagliga loop vid liv.',
            category: 'PRODUCTIVITY',
            multiplier: 1,
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
                description: 'Håll en streak i sju dagar.',
                xpReward: 50,
                rarity: 'COMMON',
                icon: 'flame-outline',
                color: '#FF8A3C',
              },
            },
          },
          {
            subtitle: 'Uppnått level 10 i produktivitet',
            color: '#F5C13C',
            icon: 'trophy-outline',
            position: 1,
            achievementDefinition: {
              create: {
                code: 'focus-master',
                title: 'Fokusmästare',
                description: 'Nå level 10 i produktivitet.',
                xpReward: 120,
                rarity: 'RARE',
                icon: 'trophy-outline',
                color: '#F5C13C',
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
                description: 'Slutför fem långsiktiga mål.',
                xpReward: 150,
                rarity: 'EPIC',
                icon: 'locate-outline',
                color: '#67D86F',
              },
            },
          },
          {
            subtitle: '30 dagars streak',
            color: '#62A5FF',
            icon: 'shield-checkmark-outline',
            position: 3,
            achievementDefinition: {
              create: {
                code: 'disciplined',
                title: 'Disciplinerad',
                description: 'Håll en 30-dagars streak.',
                xpReward: 200,
                rarity: 'EPIC',
                icon: 'shield-checkmark-outline',
                color: '#62A5FF',
              },
            },
          },
          {
            subtitle: '3240 total XP',
            color: '#A866FF',
            icon: 'sparkles-outline',
            position: 4,
            achievementDefinition: {
              create: {
                code: 'main-quest-energy',
                title: 'Main quest energy',
                description: 'Samla över 3000 XP totalt.',
                xpReward: 250,
                rarity: 'LEGENDARY',
                icon: 'sparkles-outline',
                color: '#A866FF',
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
