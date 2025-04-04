import { DynamicModule, Module } from '@nestjs/common';
import { EnvConfigModule } from '../config/env-config/env-config.module';
import { WinstonModule } from '../services/logger/winston.module';
import { reviewProxyExports, reviewProxyProviders } from '@infrastructure/usecase-proxy/review/review.proxy';
import { partnerProxyExports, partnerProxyProviders } from '@infrastructure/usecase-proxy/partner/partner.proxy';
import {userProxyExports, userProxyProviders} from "@infrastructure/usecase-proxy/user/user.proxy";
import { RepositoriesModule } from '@infrastructure/repositories/repositories.module';
import { BcryptModule } from '@infrastructure/services/hash/bcrypt.module';
import { JwtServiceModule } from '@infrastructure/services/jwt/jwt.module';
import { RequestModule } from '@infrastructure/services/request/request.module';


@Module({
  imports: [
    EnvConfigModule,
    RepositoriesModule,
    BcryptModule,
    JwtServiceModule,
    WinstonModule,
    RequestModule,
  ],
})
export class UsecaseProxyModule {
  static register(): DynamicModule {
    return {
      module: UsecaseProxyModule,
      providers: [
        ...reviewProxyProviders,
        ...partnerProxyProviders,
        ...userProxyProviders,
      ],
      exports: [
        ...reviewProxyExports,
        ...partnerProxyExports,
        ...userProxyExports,
      ],
    };
  }
}
