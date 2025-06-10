import { DynamicModule, Module } from '@nestjs/common';
import { EnvConfigModule } from '../config/env-config/env-config.module';
import { WinstonModule } from '../services/logger/winston.module';
import { reviewProxyExports } from '@application/use-case-proxies/review/review.proxy';
import { companyProxyProviders } from '@infrastructure/providers/company/company.proxy';
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
import {BullServiceModule} from "@infrastructure/services/bull/bull.module";
import {
  proxySessionProviders,
  proxySessionProxyExports
} from "@infrastructure/providers/proxy-session/proxy-session.providers";
import {LanguageDetectorServiceModule} from "@infrastructure/services/language-detector/language-detector.module";
import {TemplateServiceModule} from "@infrastructure/services/template/template.module";
import {UnitOfWorkModule} from "@infrastructure/services/unit-of-work/unit-of-work.module";
import {companyProxyExports} from "@application/use-case-proxies/company/company.proxy";

@Module({
  imports: [
    EnvConfigModule,
    RepositoriesModule,
    BcryptModule,
    JwtServiceModule,
    WinstonModule,
    RequestModule,
    BullServiceModule,
    LanguageDetectorServiceModule,
    TemplateServiceModule,
    UnitOfWorkModule
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
        ...authProxyProviders,
        ...proxySessionProviders
      ],
      exports: [
        ...reviewProxyExports,
        ...companyProxyExports,
        ...employeeProxyExports,
        ...managerProxyExports,
        ...organizationProxyExports,
        ...authProxyExports,
        ...proxySessionProxyExports,
      ],
    };
  }
}
