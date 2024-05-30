import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser';

import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configServer = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configServer.get('TCP_PORT'),
    },
  });

  app.use(cookieParser());

  // whitelist option tells the ValidationPipe to strip any properties that do not have decorators
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useLogger(app.get(Logger));

  await app.startAllMicroservices();
  await app.listen(configServer.get('HTTP_PORT'));
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap();
