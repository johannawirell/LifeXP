import { Module } from '@nestjs/common';

import { LiveUpdatesGateway } from './live-updates.gateway';

@Module({
  providers: [LiveUpdatesGateway],
  exports: [LiveUpdatesGateway],
})
export class LiveUpdatesModule {}
