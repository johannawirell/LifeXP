import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    ProfileModule,
  ],
})
export class AppModule {}
