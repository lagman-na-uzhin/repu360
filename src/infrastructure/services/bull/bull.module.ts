// bull.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { RedisModule, RedisService } from '@liaoliaots/nestjs-redis';
import { queueInjectionList } from './bull.const';
import { BullService } from './bull.service';

@Module({
  imports: [
    RedisModule,
    BullModule.forRootAsync({
      imports: [RedisModule],
      inject: [RedisService],
      useFactory: async (redisService: RedisService) => {
        const redisClient = redisService.getOrThrow("bullQueue");
        return {
          createClient: () => redisClient,
          removeOnFail: true,
          removeOnComplete: true,
        };
      },
    }),
    BullModule.registerQueue(...queueInjectionList()),
  ],
  providers: [BullService],
  exports: [BullService],
})
export class BullServiceModule {}
