import { Module } from '@nestjs/common';

import { LiveUpdatesModule } from '../live-updates/live-updates.module';
import { GoalsController } from './goals.controller';

@Module({
  imports: [LiveUpdatesModule],
  controllers: [GoalsController],
})
export class GoalsModule {}
