import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {IJwtService, IJwtServicePayload} from "@application/services/jwt/jwt-service.interface";
import {EnvConfigService} from "@infrastructure/config/env-config/env-config.service";
import {EmployeeRole} from "@domain/company/model/employee/employee-role";
import {ManagerRole} from "@domain/manager/model/manager-role";

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
    return this.jwtService.sign(JSON.stringify(payload), {
      secret: secret,
      expiresIn: expiresIn,
    });
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
