import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { PrismaClient } from '../../generated/client';

const prisma = new PrismaClient();

@Controller('profile')
export class ProfileController {
  @Get(':userId')
  async getProfile(@Param('userId') userId: string) {
    const profile = await prisma.userProfile.findUnique({
      where: {
        authUserId: userId,
      },
      include: {
        settings: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('No user profile found');
    }

    return {
      id: profile.id,
      authUserId: profile.authUserId,
      displayName: profile.displayName,
      firstName: profile.firstName,
      lastName: profile.lastName,
      avatarUrl: profile.avatarUrl,
      locale: profile.locale,
      timezone: profile.timezone,
      headline: profile.headline,
      settings: profile.settings,
    };
  }
}
