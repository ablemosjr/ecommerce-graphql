import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<INestApplication>(AppModule, {
    rawBody: true,
  });

  await app.listen(3000);
}
bootstrap();
