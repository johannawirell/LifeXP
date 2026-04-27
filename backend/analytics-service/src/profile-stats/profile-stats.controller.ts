import { Controller, Get, Param } from '@nestjs/common';
import { PrismaClient } from '../../generated/client';

const prisma = new PrismaClient();

@Controller('profile-stats')
export class ProfileStatsController {
  @Get(':userId')
  async getStats(@Param('userId') userId: string) {
    return prisma.weeklyStatCard.findMany({
      where: { userId },
      orderBy: { position: 'asc' },
    });
  }
}
