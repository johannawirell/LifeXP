import 'reflect-metadata';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  const port = Number(process.env.AUTH_SERVICE_PORT ?? 3005);
  await app.listen(port, '0.0.0.0');
  console.log(`Auth service running on http://localhost:${port}`);
}

void bootstrap();
