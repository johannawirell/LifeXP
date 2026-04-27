import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { PrismaClient } from '../../generated/client';

const prisma = new PrismaClient();

@Controller('profile-gamification')
export class ProfileGamificationController {
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
