import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EnvConfigService } from '@infrastructure/config/env-config/env-config.service';
import { EnvConfigModule } from '@infrastructure/config/env-config/env-config.module';
import { queueInjectionList } from './bull.const';
import { BullService } from './bull.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [EnvConfigModule],
      inject: [EnvConfigService],
      useFactory: async (config: EnvConfigService) => {
        return {
          redis: {
            host: config.getBullCacheHost(),
            port: config.getBullCachePort(),
            password: config.getBullCachePassword(),
            db: 1,
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
          },
        };
      },
    }),
    BullModule.registerQueue(...queueInjectionList()),
  ],
  providers: [BullService],
  exports: [BullService],
})
export class BullServiceModule {}
