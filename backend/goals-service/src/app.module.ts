import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ProfileGoalsModule } from './profile-goals/profile-goals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    ProfileGoalsModule,
  ],
})
export class AppModule {}
