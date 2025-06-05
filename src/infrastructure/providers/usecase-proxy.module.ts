import { DynamicModule, Module } from '@nestjs/common';
import { EnvConfigModule } from '../config/env-config/env-config.module';
import { WinstonModule } from '../services/logger/winston.module';
import { reviewProxyExports } from '@application/use-case-proxies/review/review.proxy';
import { companyProxyExports, companyProxyProviders } from '@infrastructure/providers/company/company.proxy';
import {employeeProxyExports, employeeProxyProviders} from "@infrastructure/providers/employee/employee.proxy";
import { RepositoriesModule } from '@infrastructure/repositories/repositories.module';
import { BcryptModule } from '@infrastructure/services/hash/bcrypt.module';
import { JwtServiceModule } from '@infrastructure/services/jwt/jwt.module';
import { RequestModule } from '@infrastructure/services/request/request.module';
import {managerProxyExports, managerProxyProviders} from "@infrastructure/providers/manager/manager.proxy";
import {
  organizationProxyExports,
  organizationProxyProviders
} from "@infrastructure/providers/organization/organization.proxy";
import {authProxyExports, authProxyProviders} from "@infrastructure/providers/auth/auth.proxy";
import {reviewProxyProviders} from "@infrastructure/providers/review/review.providers";

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
