import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { GoalsModule } from './goals/goals.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    GoalsModule,
    ProfileModule,
  ],
})
export class AppModule {}
