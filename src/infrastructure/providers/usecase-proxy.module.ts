import { DynamicModule, Module } from '@nestjs/common';
import { EnvConfigModule } from '../config/env-config/env-config.module';
import { WinstonModule } from '../services/logger/winston.module';
import { reviewProxyExports } from '@application/use-case-proxies/review/review.proxy';
import { companyProxyProviders } from '@infrastructure/providers/company/company.proxy';
import { employeeProxyProviders} from "@infrastructure/providers/employee/employee.provider";
import { RepositoriesModule } from '@infrastructure/repositories/repositories.module';
import { BcryptModule } from '@infrastructure/services/hash/bcrypt.module';
import { JwtServiceModule } from '@infrastructure/services/jwt/jwt.module';
import { RequestModule } from '@infrastructure/services/request/request.module';
import {BullServiceModule} from "@infrastructure/services/bull/bull.module";
import {LanguageDetectorServiceModule} from "@infrastructure/services/language-detector/language-detector.module";
import {TemplateServiceModule} from "@infrastructure/services/template/template.module";
import {UnitOfWorkModule} from "@infrastructure/services/unit-of-work/unit-of-work.module";
import {companyProxyExports} from "@application/use-case-proxies/company/company.proxy";
import {organizationProxyExports} from "@application/use-case-proxies/organization/organization.proxy";
import {
  proxySessionProviders,
  proxySessionProxyExports
} from "@infrastructure/providers/proxy-session/proxy-session.providers";
import {managerProxyProviders} from "@infrastructure/providers/manager/manager.proxy";
import {organizationProxyProviders} from "@infrastructure/providers/organization/organization.provider";
import {authProxyExports, authProxyProviders} from "@infrastructure/providers/auth/auth.proxy";
import {reviewProxyProviders} from "@infrastructure/providers/review/review.providers";
import {subscriptionProxyProviders} from "@infrastructure/providers/subscription/subscription.providers";
import {subscriptionProxyExports} from "@application/use-case-proxies/subscription/subscription.proxy";
import {leadProxyProviders} from "@infrastructure/providers/lead/lead.provider";
import {leadProxyExports} from "@application/use-case-proxies/lead/lead.proxy";
import {managerProxyExports} from "@application/use-case-proxies/manager/manager.proxy";
import {TwogisModule} from "@infrastructure/integrations/twogis/twogis.module";
import {externalProxyExports} from "@application/use-case-proxies/external/external.proxy";
import {externalProxyProviders} from "@infrastructure/providers/external/external.providet";
import {GoogleModule} from "@infrastructure/integrations/google/google.module";
import {employeeProxyExports} from '@application/use-case-proxies/employee/employee.proxy'
import {QueryServicesModule} from "@infrastructure/query-services/query-services.module";
import {roleProxyProviders} from "@infrastructure/providers/role/role.providers";
import {roleProxyExports} from "@application/use-case-proxies/role/role.proxy";
import {mailProxyExports} from "@application/use-case-proxies/mail/mail.proxy";
import {mailProxyProviders} from "@infrastructure/providers/mail/mail.provider";
import {MailerModule} from "@infrastructure/services/mail/mailer.module";

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
    UnitOfWorkModule,
    TwogisModule,
    GoogleModule,
    QueryServicesModule,
    MailerModule
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
        ...proxySessionProviders,
        ...subscriptionProxyProviders,
        ...leadProxyProviders,
        ...externalProxyProviders,
        ...roleProxyProviders,
        ...mailProxyProviders

      ],
      exports: [
        ...reviewProxyExports,
        ...companyProxyExports,
        ...managerProxyExports,
        ...organizationProxyExports,
        ...authProxyExports,
        ...proxySessionProxyExports,
        ...subscriptionProxyExports,
        ...leadProxyExports,
        ...externalProxyExports,
        ...employeeProxyExports,
        ...roleProxyExports,
        ...mailProxyExports
      ],
    };
  }
}
