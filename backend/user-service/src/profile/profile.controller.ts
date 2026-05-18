import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { PrismaClient } from '../../generated/client';

const prisma = new PrismaClient();

@Controller('profile')
export class ProfileController {
  @Post('provision')
  async provisionProfile(
    @Body()
    body: {
      authUserId: string;
      email: string;
      displayName: string;
      firstName?: string;
      lastName?: string;
      avatarUrl?: string;
    }
  ) {
    const profile = await prisma.userProfile.upsert({
      where: {
        authUserId: body.authUserId,
      },
      update: {
        email: body.email,
        displayName: body.displayName,
        firstName: body.firstName,
        lastName: body.lastName,
        avatarUrl: body.avatarUrl,
      },
      create: {
        authUserId: body.authUserId,
        email: body.email,
        displayName: body.displayName,
        firstName: body.firstName,
        lastName: body.lastName,
        avatarUrl: body.avatarUrl,
        settings: {
          create: {},
        },
      },
      include: {
        settings: true,
      },
    });

    return {
      id: profile.id,
      authUserId: profile.authUserId,
    };
  }

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
