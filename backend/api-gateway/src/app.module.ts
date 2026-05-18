import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { GoalsModule } from './goals/goals.module';
import { LiveUpdatesModule } from './live-updates/live-updates.module';
import { ProfileModule } from './profile/profile.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    AuthModule,
    GoalsModule,
    LiveUpdatesModule,
    ProfileModule,
    StatisticsModule,
  ],
})
export class AppModule {}
