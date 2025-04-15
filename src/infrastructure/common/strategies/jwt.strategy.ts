import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IJwtServicePayload } from '@application/interfaces/services/jwt/jwt-service.interface';
import { EnvConfigService } from '@infrastructure/config/env-config/env-config.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { CACHE_KEY } from '@application/interfaces/repositories/cache/cache-key.const';
import { FastifyRequest } from 'fastify';
import {EmployeeAuthDataType} from "@application/interfaces/repositories/cache/types/employee-auth-data.type";
import {Actor} from "@domain/policy/actor";
import {Role} from "@domain/policy/model/role";
import {RoleType} from "@domain/policy/value-object/role/type.vo";
import {ManagerPermissions} from "@domain/policy/model/manager-permissions";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
      private readonly envConfigService: EnvConfigService,
      private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: FastifyRequest) => {
          return request.cookies?.Authentication ?? null;
        },
      ]),
      secretOrKey: envConfigService.getJwtSecret(),
    } as any);

  }

  async validate(payload: IJwtServicePayload) {
    const { authId, ownerId, user } = payload;

    const redisClient = this.redisService.getOrThrow('default');

    const rawUserData = ownerId
        ? await redisClient.get(CACHE_KEY.COMMON.MULTIPLE_AUTH_TOKEN(ownerId, authId))
        : await redisClient.get(CACHE_KEY.COMMON.AUTH_TOKEN(authId));

    if (!rawUserData) return false;

    const actor = this.getActor(rawUserData)

    return {...actor}
  }

  private getActor(raw: string) {
    const persistence: EmployeeAuthDataType = JSON.parse(raw);

    let permissions;
    if (new RoleType(persistence.role.type).isStaff()) {
      permissions = ManagerPermissions.fromPersistence(persistence.role.permissions.companies)
    }

    const role = Role.fromPersistence(
        persistence.role.id,
        persistence.role.name,
        persistence.role.type,
        permissions

    )
    return Actor.fromPersistence(
        persistence.id,
        role
    )
  }
}
