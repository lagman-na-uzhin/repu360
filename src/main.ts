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
const qs = require('qs');

async function bootstrap() {
  const adapter = new FastifyAdapter({
    querystringParser: str => qs.parse(str),
  });

  const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      adapter,
      {
        logger:
            process.env.NODE_ENV === 'development'
                ? ['log', 'debug', 'error', 'verbose', 'warn']
                : ['error', 'warn'],
      },
  );

  app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
  );

  await app.register(fastifyCookie);

  await app.register(fastifyCors, {
    credentials: true,
    origin: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalFilters(new AllExceptionFilter(new WinstonService()));

  if (isInitTypeEnv(TYPE_ENV.FACE)) {
    console.log('STARTED SERVER');
    await app.listen(3000);
  } else {
    console.log('STARTED INIT');
    await app.init();
  }

  console.log('Server started at http://localhost:3000');
}
bootstrap();
