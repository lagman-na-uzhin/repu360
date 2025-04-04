import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from '@infrastructure/common/filter/exception.filter';
import { WinstonService } from '@infrastructure/services/logger/winston.service';
import { isInitTypeEnv, TYPE_ENV } from './init';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as fastifyCookie from '@fastify/cookie';
import * as fastifyCors from '@fastify/cors';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger:
        process.env.NODE_ENV === 'development'
          ? ['log', 'debug', 'error', 'verbose', 'warn']
          : ['error', 'warn'],
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({ validateCustomDecorators: true, transform: true }),
  );

  await app.register(fastifyCookie);

  await app.register(fastifyCors, { credentials: true, origin: true });

  app.useGlobalFilters(new AllExceptionFilter(new WinstonService()));

  if (isInitTypeEnv(TYPE_ENV.FACE)) {
    console.log('STARTED SERVER');
    await app.listen(3000, '0.0.0.0');
  } else {
    console.log('STARTED INIT');
    await app.init();
  }

  console.log('Server started at http://localhost:3000');
}
bootstrap();
