import { DynamicModule, Module } from '@nestjs/common';
import { EnvConfigModule } from '../config/env-config/env-config.module';
import { WinstonModule } from '../services/logger/winston.module';
import { reviewProxyExports, reviewProxyProviders } from '@infrastructure/usecase-proxy/review/review.proxy';
import { companyProxyExports, companyProxyProviders } from '@infrastructure/usecase-proxy/company/company.proxy';
import {employeeProxyExports, employeeProxyProviders} from "@infrastructure/usecase-proxy/employee/employee.proxy";
import { RepositoriesModule } from '@infrastructure/repositories/repositories.module';
import { BcryptModule } from '@infrastructure/services/hash/bcrypt.module';
import { JwtServiceModule } from '@infrastructure/services/jwt/jwt.module';
import { RequestModule } from '@infrastructure/services/request/request.module';
import {managerProxyExports, managerProxyProviders} from "@infrastructure/usecase-proxy/manager/manager.proxy";
import {
  organizationProxyExports,
  organizationProxyProviders
} from "@infrastructure/usecase-proxy/organization/organization.proxy";
import {authProxyExports, authProxyProviders} from "@infrastructure/usecase-proxy/auth/auth.proxy";

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
        ...companyProxyProviders,
        ...employeeProxyProviders,
          ...managerProxyProviders,
          ...organizationProxyProviders,
              ...authProxyProviders
      ],
      exports: [
        ...reviewProxyExports,
        ...companyProxyExports,
        ...employeeProxyExports,
          ...managerProxyExports,
          ...organizationProxyExports,
          ...authProxyExports
      ],
    };
  }
}
