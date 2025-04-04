import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IJwtServicePayload } from '@application/services/jwt/jwt-service.interface';
import { EnvConfigService } from '@infrastructure/config/env-config/env-config.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { CACHE_KEY } from '@application/repositories/cache/cache-key.const';
import { FastifyRequest } from 'fastify';

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

    const userAuthToken = !payload?.ownerId
        ? await redisClient.get(CACHE_KEY.USER.AUTH_TOKEN(payload.authId.toString()))
        : await redisClient.get(CACHE_KEY.USER.MULTIPLE_AUTH_TOKEN(payload.ownerId.toString(), payload.authId.toString()));

    console.log(userAuthToken, 'userAuthToken')
    if (!userAuthToken) return false;

    const permissions = JSON.parse(userAuthToken);

    return { ...payload, permissions };
  }
}
