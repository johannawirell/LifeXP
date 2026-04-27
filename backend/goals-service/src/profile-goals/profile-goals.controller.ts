import { Controller, Get, Param } from '@nestjs/common';
import { PrismaClient } from '../../generated/client';

const prisma = new PrismaClient();

@Controller('profile-goals')
export class ProfileGoalsController {
  @Get(':userId')
  async getGoals(@Param('userId') userId: string) {
    const goals = await prisma.goal.findMany({
      where: {
        userId,
        status: 'ACTIVE',
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return goals.map((goal) => ({
      id: goal.id,
      icon: goal.icon ?? 'flag-outline',
      title: goal.title,
      subtitle: goal.description ?? '',
      progress: goal.targetValue && goal.currentValue ? Number(goal.currentValue) / Number(goal.targetValue) : 0,
      color: goal.cardColor ?? '#73D86A',
      percentLabel: goal.percentLabel ?? '0 %',
    }));
  }
}
