import { Controller, Get, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller('profile')
export class ProfileController {
  @Get()
  async getProfile() {
    const profile = await prisma.userProfile.findFirst({
      include: {
        focusAreas: {
          orderBy: {
            position: 'asc',
          },
        },
        activeGoals: {
          orderBy: {
            position: 'asc',
          },
        },
        achievements: {
          orderBy: {
            position: 'asc',
          },
        },
        weeklyStats: {
          orderBy: {
            position: 'asc',
          },
        },
        settings: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('No user profile found');
    }

    return profile;
  }
}
