import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { PrismaClient } from '../../generated/client';

const prisma = new PrismaClient();
const defaultFocusAreas = [
  { icon: 'locate-outline', title: 'Fokus', level: 1, currentXp: 0, maxXp: 1000, color: '#5E8BFF' },
  { icon: 'flash-outline', title: 'Energi', level: 1, currentXp: 0, maxXp: 1000, color: '#F5C13C' },
  { icon: 'shield-checkmark-outline', title: 'Disciplin', level: 1, currentXp: 0, maxXp: 1000, color: '#67D86F' },
  { icon: 'leaf-outline', title: 'Balans', level: 1, currentXp: 0, maxXp: 1000, color: '#A866FF' },
] as const;

@Controller('profile-gamification')
export class ProfileGamificationController {
  @Post('provision')
  async provisionGamification(@Body() body: { userId: string }) {
    const existing = await prisma.userGamification.findUnique({
      where: {
        userId: body.userId,
      },
    });

    if (existing) {
      return existing;
    }

    return prisma.userGamification.create({
      data: {
        userId: body.userId,
        totalXp: 0,
        currentLevel: 1,
        currentStreak: 0,
        bestStreak: 0,
        nextLevelXp: 1000,
        headline: 'Ny i appen • Bygger momentum',
        focusAreas: {
          create: defaultFocusAreas.map((area, index) => ({
            ...area,
            position: index,
          })),
        },
      },
    });
  }

  @Get(':userId')
  async getGamification(@Param('userId') userId: string) {
    const record = await prisma.userGamification.findUnique({
      where: { userId },
      include: {
        focusAreas: {
          orderBy: { position: 'asc' },
        },
        achievements: {
          orderBy: { position: 'asc' },
          include: {
            achievementDefinition: true,
          },
        },
      },
    });

    if (!record) {
      throw new NotFoundException('No gamification profile found');
    }

    return {
      currentLevel: record.currentLevel,
      totalXp: record.totalXp,
      nextLevelXp: record.nextLevelXp,
      headline: record.headline,
      focusAreas: record.focusAreas,
      achievements: record.achievements.map((achievement) => ({
        id: achievement.id,
        icon: achievement.icon ?? 'trophy-outline',
        title: achievement.achievementDefinition.title,
        subtitle: achievement.subtitle ?? '',
        color: achievement.color ?? '#A866FF',
      })),
    };
  }
}
