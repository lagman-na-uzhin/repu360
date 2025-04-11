import { Redis } from 'ioredis';
import {Injectable} from "@nestjs/common";
import {ICacheRepository} from "@application/interfaces/repositories/cache/cache-repository.interface";
import { RedisService} from "@liaoliaots/nestjs-redis";
import {ManagerPermission} from "@domain/manager/value-object/manager-permission";
import {CACHE_KEY} from "@application/interfaces/repositories/cache/cache-key.const";
import {CACHE_TTL} from "@application/interfaces/repositories/cache/cache-ttl.const";


@Injectable()
export class CacheRepository implements ICacheRepository {
  private readonly client: Redis;

  constructor(private readonly redisService: RedisService) {
    this.client = this.redisService.getOrThrow('default');
  }
  async setUserAuthToken(userId: string, userPermissions: ManagerPermission | null) {
    const key = CACHE_KEY.USER.AUTH_TOKEN(userId);
    const test = await this.client.set(key, JSON.stringify(userPermissions), 'EX',  CACHE_TTL.ONE_DAY)
    console.log(test);
  }
}
