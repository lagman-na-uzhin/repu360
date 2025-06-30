import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {ICompanyRepository} from "@domain/company/repositories/company-repository.interface";
import {CompanyOrmRepository} from "@infrastructure/repositories/company/company.repository";
import {
    CreateSubscriptionUseCase
} from "@application/use-cases/default/subscription/create/create-subscription.usecase";
import {SubscriptionProxy} from "@application/use-case-proxies/subscription/subscription.proxy";
import {ITariffRepository} from "@domain/subscription/repositories/tariff-repository.interface";
import {ISubscriptionRepository} from "@domain/subscription/repositories/subscription-repository.interface";
import {TariffOrmRepository} from "@infrastructure/repositories/subscription/tariff.repository";
import {SubscriptionOrmRepository} from "@infrastructure/repositories/subscription/subscription.repository";

export const subscriptionProxyProviders = [
    {
        inject: [CompanyOrmRepository, TariffOrmRepository, SubscriptionOrmRepository],
        provide: SubscriptionProxy.CREATE_SUBSCRIPTION_USE_CASE,
        useFactory: (
            companyRepo: ICompanyRepository,
            tariffRepo: ITariffRepository,
            subscriptionRepo: ISubscriptionRepository
        ) => {
            return new UseCaseProxy(new CreateSubscriptionUseCase(companyRepo, tariffRepo, subscriptionRepo))
        }
    },
]

