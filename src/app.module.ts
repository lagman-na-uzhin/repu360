import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import * as TelegramBot from 'node-telegram-bot-api';
import * as os from 'os';
import { LoggingInterceptor } from '@infrastructure/common/interceptors/logging.interceptor';
import { ResponseInterceptor } from '@infrastructure/common/interceptors/response.interceptor';
import { JwtStrategy } from '@infrastructure/common/strategies/jwt.strategy';
import { EnvConfigModule } from '@infrastructure/config/env-config/env-config.module';
import { EnvConfigService } from '@infrastructure/config/env-config/env-config.service';
import { UsecaseProxyModule } from '@infrastructure/providers/usecase-proxy.module';
import {BackgroundModule} from "@presentation/background/background.module";
import { DefaultModule } from '@presentation/default/default.module';
import {ControlModule} from "@presentation/control/control.module";
import {GeneralModule} from "@presentation/general/general.module";
import {LanguageDetectorServiceModule} from "@infrastructure/services/language-detector/language-detector.module";
import {TemplateServiceModule} from "@infrastructure/services/template/template.module";
import {UnitOfWorkModule} from "@infrastructure/services/unit-of-work/unit-of-work.module";
import {TwogisModule} from "@infrastructure/integrations/twogis/twogis.module";
import {TestController} from "@presentation/test.controller";

@Module({
  imports: [
    UsecaseProxyModule.register(),
    PassportModule,
    ScheduleModule.forRoot(),
    EnvConfigModule,
    RedisModule.forRootAsync({
      imports: [EnvConfigModule],
      inject: [EnvConfigService],
      useFactory: async (
          config: EnvConfigService,
      ): Promise<RedisModuleOptions> => {
        const bot = new TelegramBot(
            '7162219154:AAFB61wsnS7wON_siR5L2cTxfoqbPMVB9-I',
            { polling: false },
        );
        const chatId = '-4173579788';
        let attempts = 0;

        return {
          config: [
            {
              namespace: 'default',
              host: config.getCacheHost(),
              port: config.getCachePort(),
              password: config.getCachePassword(),
              onClientCreated(client) {
                console.log('Default Redis connected successfully');
                client.on('error', (error) => {
                  console.error('Default Redis error:', error);
                  attempts++;
                  if (attempts === 1 || attempts % 30 === 0) {
                    bot
                        .sendMessage(
                            chatId,
                            `Default Redis error (repu backend), env:${process.env.NODE_ENV}, hostname: ${os.hostname()}`,
                        )
                        .catch(console.error);
                  }
                });
              },
            },
          ],
        };
      },
    }),
      BackgroundModule,
      DefaultModule,
      ControlModule,
      GeneralModule,
    LanguageDetectorServiceModule,
    TemplateServiceModule,
    UnitOfWorkModule,
    TwogisModule
  ],
  controllers: [TestController], //TODO TEST
  providers: [
    JwtStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
