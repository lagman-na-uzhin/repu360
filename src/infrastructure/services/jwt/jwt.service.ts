import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {IJwtService, IJwtServicePayload} from "@application/interfaces/services/jwt/jwt-service.interface";
import {EnvConfigService} from "@infrastructure/config/env-config/env-config.service";

@Injectable()
export class JwtTokenService implements IJwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envConfigService: EnvConfigService,
  ) {}

  checkToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }

  createToken(
    payload: IJwtServicePayload,
    secret: string,
    expiresIn: string,
  ): string {
    return this.jwtService.sign(payload, {
      secret: secret,
      expiresIn: expiresIn,
    });
  }

  generateUserToken(userId: string) {
      const secret = this.getJwtSecret();
      const expiresIn = `${this.getJwtRefreshExpirationTime()}s`;

      const payload: IJwtServicePayload = {authId: userId};
      return this.createToken(payload, secret, expiresIn);
  }

  getJwtSecret(): string {
    return this.envConfigService.getJwtSecret();
  }

  getJwtRefreshExpirationTime(): string {
    return this.envConfigService.getJwtRefreshExpirationTime();
  }

  getJwtExpirationTime(): string {
    return this.envConfigService.getJwtExpirationTime();
  }

  getJwtRefreshSecret(): string {
    return  this.envConfigService.getJwtRefreshSecret();
  }
}
