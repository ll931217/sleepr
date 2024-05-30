import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';

import { ReservationsModule } from './reservations.module';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);

  app.use(cookieParser());

  // whitelist option tells the ValidationPipe to strip any properties that do not have decorators
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useLogger(app.get(Logger));

  const configServer = app.get(ConfigService);
  await app.listen(configServer.get('PORT') || 3000);
}
bootstrap();
