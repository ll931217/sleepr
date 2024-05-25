import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  // whitelist option tells the ValidationPipe to strip any properties that do not have decorators
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useLogger(app.get(Logger));

  const configServer = app.get(ConfigService);
  await app.listen(configServer.get('PORT') || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap();
