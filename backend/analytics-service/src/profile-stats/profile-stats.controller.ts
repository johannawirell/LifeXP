import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import axios from 'axios';
import { PrismaClient } from '../../generated/client';

const prisma = new PrismaClient();

@Controller('profile-stats')
export class ProfileStatsController {
  @Post('provision')
  async provisionStats(@Body() body: { userId: string }) {
    const existing = await prisma.weeklyStatCard.findFirst({
      where: {
        userId: body.userId,
      },
    });

    if (existing) {
      return { success: true };
    }

    await prisma.weeklyStatCard.createMany({
      data: [
        {
          userId: body.userId,
          icon: 'checkmark-circle-outline',
          value: '0',
          label: 'Quests klara',
          detail: '+0 % från förra veckan',
          color: '#A866FF',
          position: 0,
        },
        {
          userId: body.userId,
          icon: 'star-outline',
          value: '0',
          label: 'Total XP',
          detail: '+0 % från förra veckan',
          color: '#F5C13C',
          position: 1,
        },
        {
          userId: body.userId,
          icon: 'radio-button-on-outline',
          value: '0 %',
          label: 'Måluppfyllelse',
          detail: '+0 % från förra veckan',
          color: '#67D86F',
          position: 2,
        },
        {
          userId: body.userId,
          icon: 'flame-outline',
          value: '0',
          label: 'Dagar i streak',
          detail: 'Bästa: 0 dagar',
          color: '#FF8A3C',
          position: 3,
        },
      ],
    });

    return { success: true };
  }

  @Get(':userId')
  async getStats(@Param('userId') userId: string) {
    const goalsServiceUrl = process.env.GOALS_SERVICE_URL ?? 'http://localhost:3002';
    const gamificationServiceUrl = process.env.GAMIFICATION_SERVICE_URL ?? 'http://localhost:3004';

    const [weeklyCards, periods, activity, categorySnapshots, goalSummaryResponse, gamificationResponse] =
      await Promise.all([
        prisma.weeklyStatCard.findMany({
          where: { userId },
          orderBy: { position: 'asc' },
        }),
        prisma.statisticsPeriodSnapshot.findMany({
          where: { userId },
        }),
        prisma.activityPoint.findMany({
          where: { userId },
          orderBy: [{ period: 'asc' }, { position: 'asc' }],
        }),
        prisma.categoryProgressSnapshot.findMany({
          where: { userId },
          orderBy: { position: 'asc' },
        }),
        axios.get(`${goalsServiceUrl}/goals/${userId}/summary`),
        axios.get(`${gamificationServiceUrl}/profile-gamification/${userId}`),
      ]);

    const goalSummary = goalSummaryResponse.data as {
      completedGoals: number;
      activeGoals: number;
      completedMilestones: number;
      totalMilestones: number;
      averageProgress: string;
      streakDays: number;
      completedQuests: number;
      totalQuestXp: number;
    };
    const gamification = gamificationResponse.data as {
      totalXp: number;
      currentLevel: number;
      xpToNextLevel: number;
      currentStreak: number;
      bestStreak: number;
      focusAreas: {
        key: string;
        title: string;
        level: number;
        currentXp: number;
        maxXp: number;
        color: string;
      }[];
    };

    const completionRate =
      goalSummary.totalMilestones > 0
        ? `${Math.round((goalSummary.completedMilestones / goalSummary.totalMilestones) * 100)} %`
        : '0 %';
    const periodSnapshots =
      periods.length > 0
        ? periods
        : [
            {
              id: 'daily-fallback',
              period: 'DAILY',
              label: 'Idag',
              totalXp: 0,
              completedQuests: 0,
              completedGoals: 0,
              streakDays: gamification.currentStreak,
              activityScore: 0,
            },
            {
              id: 'weekly-fallback',
              period: 'WEEKLY',
              label: 'Denna vecka',
              totalXp: gamification.totalXp,
              completedQuests: goalSummary.completedQuests,
              completedGoals: goalSummary.completedGoals,
              streakDays: gamification.currentStreak,
              activityScore: Number.parseInt(completionRate, 10) || 0,
            },
            {
              id: 'monthly-fallback',
              period: 'MONTHLY',
              label: 'Denna månad',
              totalXp: gamification.totalXp,
              completedQuests: goalSummary.completedQuests,
              completedGoals: goalSummary.completedGoals,
              streakDays: gamification.currentStreak,
              activityScore: Number.parseInt(completionRate, 10) || 0,
            },
          ];
    const activityPoints =
      activity.length > 0
        ? activity
        : [
            { id: 'activity-mon', period: 'WEEKLY', label: 'Mån', value: Math.max(goalSummary.completedQuests, 0) },
            { id: 'activity-tue', period: 'WEEKLY', label: 'Tis', value: Math.max(goalSummary.completedMilestones, 0) },
            { id: 'activity-wed', period: 'WEEKLY', label: 'Ons', value: Math.max(Math.round(gamification.totalXp / 50), 0) },
            { id: 'activity-thu', period: 'WEEKLY', label: 'Tor', value: Math.max(goalSummary.activeGoals, 0) },
            { id: 'activity-fri', period: 'WEEKLY', label: 'Fre', value: Math.max(gamification.currentStreak, 0) },
            { id: 'activity-sat', period: 'WEEKLY', label: 'Lör', value: 0 },
            { id: 'activity-sun', period: 'WEEKLY', label: 'Sön', value: 0 },
          ];

    return {
      weeklyCards: [
        {
          id: weeklyCards[0]?.id ?? 'quests',
          icon: 'checkmark-circle-outline',
          value: String(goalSummary.completedQuests),
          label: 'Quests klara',
          detail: weeklyCards[0]?.detail ?? '+0 % från förra veckan',
          color: '#A866FF',
        },
        {
          id: weeklyCards[1]?.id ?? 'xp',
          icon: 'star-outline',
          value: gamification.totalXp.toLocaleString('sv-SE'),
          label: 'Total XP',
          detail: weeklyCards[1]?.detail ?? '+0 % från förra veckan',
          color: '#F5C13C',
        },
        {
          id: weeklyCards[2]?.id ?? 'goals',
          icon: 'radio-button-on-outline',
          value: completionRate,
          label: 'Måluppfyllelse',
          detail: weeklyCards[2]?.detail ?? '+0 % från förra veckan',
          color: '#67D86F',
        },
        {
          id: weeklyCards[3]?.id ?? 'streak',
          icon: 'flame-outline',
          value: String(gamification.currentStreak),
          label: 'Dagar i streak',
          detail: `Bästa: ${gamification.bestStreak} dagar`,
          color: '#FF8A3C',
        },
      ],
      statisticsCards: [
        {
          id: 'statistics-quests',
          icon: 'checkmark-circle-outline',
          value: String(goalSummary.completedQuests),
          label: 'Quests klara',
          detail: '+0 % från förra veckan',
          color: '#A866FF',
        },
        {
          id: 'statistics-xp',
          icon: 'star-outline',
          value: gamification.totalXp.toLocaleString('sv-SE'),
          label: 'Total XP',
          detail: '+0 % från förra veckan',
          color: '#F5C13C',
        },
        {
          id: 'statistics-completion',
          icon: 'radio-button-on-outline',
          value: completionRate,
          label: 'Måluppfyllelse',
          detail: '+0 % från förra veckan',
          color: '#67D86F',
        },
        {
          id: 'statistics-progress',
          icon: 'stats-chart-outline',
          value: goalSummary.averageProgress,
          label: 'Snitt. framsteg',
          detail: 'Aktiva mål',
          color: '#56D2C5',
        },
        {
          id: 'statistics-streak',
          icon: 'flame-outline',
          value: String(goalSummary.streakDays),
          label: 'Dagar i streak',
          detail: `Bästa: ${gamification.bestStreak} dagar`,
          color: '#FF8A3C',
        },
        {
          id: 'statistics-quest-xp',
          icon: 'sparkles-outline',
          value: goalSummary.totalQuestXp.toLocaleString('sv-SE'),
          label: 'Quest XP',
          detail: 'Samlad questbelöning',
          color: '#5E8BFF',
        },
      ],
      periods: periodSnapshots.map((period) => ({
        id: period.id,
        key: period.period.toLowerCase(),
        label: period.label,
        totalXp: period.totalXp,
        completedQuests: period.completedQuests,
        completedGoals: period.completedGoals,
        streakDays: period.streakDays,
        activityScore: period.activityScore,
      })),
      activity: activityPoints.map((point) => ({
        id: point.id,
        period: point.period.toLowerCase(),
        label: point.label,
        value: point.value,
      })),
      categoryProgress:
        categorySnapshots.length > 0
          ? categorySnapshots.map((snapshot) => ({
              id: snapshot.id,
              key: snapshot.categoryKey,
              label: snapshot.label,
              level: snapshot.level,
              currentXp: snapshot.currentXp,
              nextLevelXp: snapshot.nextLevelXp,
              color: snapshot.color,
            }))
          : gamification.focusAreas.map((area) => ({
              id: area.key,
              key: area.key,
              label: area.title,
              level: area.level,
              currentXp: area.currentXp,
              nextLevelXp: area.maxXp,
              color: area.color,
            })),
      liveSummary: {
        totalXp: gamification.totalXp,
        level: gamification.currentLevel,
        xpToNextLevel: gamification.xpToNextLevel,
        completedQuests: goalSummary.completedQuests,
        completedGoals: goalSummary.completedGoals,
        currentStreak: gamification.currentStreak,
      },
    };
  }
}
