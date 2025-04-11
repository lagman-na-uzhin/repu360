import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IJwtServicePayload } from '@application/interfaces/services/jwt/jwt-service.interface';
import { EnvConfigService } from '@infrastructure/config/env-config/env-config.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { CACHE_KEY } from '@application/interfaces/repositories/cache/cache-key.const';
import { FastifyRequest } from 'fastify';
import {EmployeeRole} from "@domain/employee/model/employee-role";
import {Employee} from "@domain/employee/employee";
import {ManagerId} from "@domain/manager/manager";

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
    const redisClient = this.redisService.getOrThrow('default');

    const userAuth = payload?.ownerId
        ? await redisClient.get(CACHE_KEY.USER.MULTIPLE_AUTH_TOKEN(payload.ownerId, payload.authId))
        : await redisClient.get(CACHE_KEY.USER.AUTH_TOKEN(payload.authId));

    if (!userAuth) return false;

    const parsedData = JSON.parse(userAuth);

    const employeeRole = EmployeeRole.fromPersistence(
        parsedData.id,
        parsedData.name,
        parsedData.type,
        parsedData.permissions,
    );

    return {ownerId: payload?.ownerId ? new ManagerId(payload.ownerId) : null, actor: employeeRole};
  }
}
