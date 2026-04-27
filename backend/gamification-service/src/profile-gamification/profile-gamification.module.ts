import { Module } from '@nestjs/common';

import { ProfileGamificationController } from './profile-gamification.controller';

@Module({
  controllers: [ProfileGamificationController],
})
export class ProfileGamificationModule {}
