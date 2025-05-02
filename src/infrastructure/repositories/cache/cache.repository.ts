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
import {ManagerAuthDataType} from "@application/interfaces/repositories/cache/types/manager-auth-data.type";


@Injectable()
export class CacheRepository implements ICacheRepository {
  private readonly client: Redis;

  constructor(private readonly redisService: RedisService) {
    this.client = this.redisService.getOrThrow('default');
  }

  async setEmployeeAuth(employee: Employee, role: Role): Promise<void> {
    const key = CACHE_KEY.COMMON.AUTH_TOKEN(employee.id.toString());

    const exist = await this.isExist(key);
    if (exist) {
      await this.client.del(key);
    }

    const data: EmployeeAuthDataType = <EmployeeAuthDataType>{
      id: employee.id.toString(),
      role: {
        id: role.id.toString(),
        name: role.name?.toString() || null,
        type: role.type.toString(),
        permissions: {
          reviews: Array.from(role.employeePermissions.reviews.entries()).map(([orgId, permissions]) => ({
            organizationId: orgId.toString(),
            permissions: Array.from(permissions),
          })),
          companies: Array.from(role.managerPermissions.companies)
        },
      }
    };

    await this.client.set(key, JSON.stringify(data), 'EX', CACHE_TTL.ONE_DAY);
  }



  async setManagerAuth(manager: Manager, role: Role): Promise<void> {
    const key = CACHE_KEY.COMMON.AUTH_TOKEN(manager.id.toString());

    const exist = await this.isExist(key);
    if (exist) {
      await this.client.del(key);
    }

    const data: ManagerAuthDataType = <ManagerAuthDataType>{
      id: manager.id.toString(),
      role: {
        id: role.id.toString(),
        name: role.name?.toString() || null,
        type: role.type.toString(),
        permissions: {
          companies: Array.from(role.managerPermissions.companies)
        },
      }
    };
    console.log(data, "cache data")

    await this.client.set(key, JSON.stringify(data), 'EX', CACHE_TTL.ONE_DAY);
  }

  async isExist(key: string): Promise<boolean> {
    const exist = await this.client.get(key);
    return !!exist;
  }
}
