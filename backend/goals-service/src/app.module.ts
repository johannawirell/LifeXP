import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { GoalsModule } from './goals/goals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    GoalsModule,
  ],
})
export class AppModule {}
