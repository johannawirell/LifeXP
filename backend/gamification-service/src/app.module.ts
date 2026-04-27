import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ProfileGamificationModule } from './profile-gamification/profile-gamification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    ProfileGamificationModule,
  ],
})
export class AppModule {}
