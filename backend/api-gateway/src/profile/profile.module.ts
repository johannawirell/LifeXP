import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ProfileController } from './profile.controller';

@Module({
  imports: [HttpModule],
  controllers: [ProfileController],
})
export class ProfileModule {}
