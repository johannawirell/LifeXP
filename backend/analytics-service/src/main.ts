import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const port = Number(process.env.ANALYTICS_SERVICE_PORT ?? 3003);
  await app.listen(port, '0.0.0.0');
  console.log(`Analytics service running on http://localhost:${port}`);
}

void bootstrap();
