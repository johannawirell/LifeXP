import { Module } from '@nestjs/common';

import { ProfileGoalsController } from './profile-goals.controller';

@Module({
  controllers: [ProfileGoalsController],
})
export class ProfileGoalsModule {}
