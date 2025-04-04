import { Module } from '@nestjs/common';
import { JwtTokenService } from './jwt.service';

import { JwtModule as Jwt } from '@nestjs/jwt';
import { EnvConfigService } from 'src/infrastructure/config/env-config/env-config.service';
import { EnvConfigModule } from 'src/infrastructure/config/env-config/env-config.module';

@Module({
  imports: [
    EnvConfigModule,
    Jwt.registerAsync({
      imports: [EnvConfigModule],
      inject: [EnvConfigService],
      useFactory: async (config: EnvConfigService) => {
        return {
          secret: config.getJwtSecret(),
          signOptions: {
            expiresIn: `${config.getJwtExpirationTime()}s`,
          },
        };
      },
    }),
  ],
  providers: [JwtTokenService],
  exports: [JwtTokenService],
})
export class JwtServiceModule {}
