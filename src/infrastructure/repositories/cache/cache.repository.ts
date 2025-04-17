import { Redis } from 'ioredis';
import {Injectable} from "@nestjs/common";
import {ICacheRepository} from "@application/interfaces/repositories/cache/cache-repository.interface";
import {RedisService} from "@liaoliaots/nestjs-redis";
import {CACHE_KEY} from "@application/interfaces/repositories/cache/cache-key.const";
import {CACHE_TTL} from "@application/interfaces/repositories/cache/cache-ttl.const";
import {Employee} from "@domain/employee/employee";
import {Manager} from "@domain/manager/manager";
import {EmployeeAuthDataType} from "@application/interfaces/repositories/cache/types/employee-auth-data.type";
import {Role} from "@domain/policy/model/role";


@Injectable()
export class CacheRepository implements ICacheRepository {
  private readonly client: Redis;

  constructor(private readonly redisService: RedisService) {
    this.client = this.redisService.getOrThrow('default');
  }

  async setEmployeeAuth(employee: Employee, role: Role): Promise<void> {
    const key = CACHE_KEY.COMMON.AUTH_TOKEN(employee.id.toString());

    const reviewPermissions = [];

    for (const [orgId, permissions] of employee.role.permissions.reviews.entries()) {
      for (const permission of permissions) {
        reviewPermissions.push({
          module: 'reviews',
          permission,
          organizationId: orgId.toString(),
        });
      }
    }

    const companyPermissions = Array.from(employee.role.permissions.company).map(permission => ({
      module: 'company',
      permission,
      organizationId: null,
    }));

    const data: EmployeeAuthDataType = {
      id: employee.id.toString(),
      role: {
        name: role.name?.toString() ?? null,
        type: role.type.toString(),
        permissions: {
          reviews: reviewPermissions,
          company: companyPermissions,
        }
      }
    };

    await this.client.set(key, JSON.stringify(data), 'EX', CACHE_TTL.ONE_DAY);
  }


  async setManagerAuth(manager: Manager): Promise<void> {
    const key = CACHE_KEY.COMMON.AUTH_TOKEN(manager.id.toString());
    await this.client.set(key, JSON.stringify(manager), 'EX',  CACHE_TTL.ONE_DAY)
  }
}
