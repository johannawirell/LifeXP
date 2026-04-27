import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ProfileStatsModule } from './profile-stats/profile-stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    ProfileStatsModule,
  ],
})
export class AppModule {}
