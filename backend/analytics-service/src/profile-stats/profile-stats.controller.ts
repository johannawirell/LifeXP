import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PrismaClient } from '../../generated/client';

const prisma = new PrismaClient();
const defaultWeeklyStatCards = [
  { icon: 'checkmark-circle-outline', value: '0', label: 'Tasks klara', detail: '+0 % från förra veckan', color: '#A866FF' },
  { icon: 'star-outline', value: '0', label: 'XP denna vecka', detail: '+0 % från förra veckan', color: '#F5C13C' },
  { icon: 'radio-button-on-outline', value: '0 %', label: 'Måluppfyllelse', detail: '+0 % från förra veckan', color: '#67D86F' },
  { icon: 'flame-outline', value: '0', label: 'Dagar i streak', detail: 'Bästa: 0 dagar', color: '#F08A45' },
] as const;

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
      data: defaultWeeklyStatCards.map((card, index) => ({
        userId: body.userId,
        icon: card.icon,
        value: card.value,
        label: card.label,
        detail: card.detail,
        color: card.color,
        position: index,
      })),
    });

    return { success: true };
  }

  @Get(':userId')
  async getStats(@Param('userId') userId: string) {
    return prisma.weeklyStatCard.findMany({
      where: { userId },
      orderBy: { position: 'asc' },
    });
  }
}
