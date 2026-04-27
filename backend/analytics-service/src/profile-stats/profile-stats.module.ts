import { Module } from '@nestjs/common';

import { ProfileStatsController } from './profile-stats.controller';

@Module({
  controllers: [ProfileStatsController],
})
export class ProfileStatsModule {}
