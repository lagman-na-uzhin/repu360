import { ProxyPrefix } from '@application/use-case-proxies/proxy-prefix';
import {IOrganizationRepository} from "@domain/organization/repositories/organization-repository.interface";
import {
    GetOrganizationListUseCase
} from "@application/use-cases/default/organization/queries/get-list-by-company/get-list-by-company.usecase";
import {OrganizationOrmRepository} from "@infrastructure/repositories/organization/organization.repository";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";

export const OrganizationProxy = {
    //DEFAULT
    "GET_LIST": `${ProxyPrefix.USER_PROXY}GetOrganizationListUseCaseProxy`,
} as const;

export const organizationProxyProviders = [
    {
        inject: [OrganizationOrmRepository],
        provide: OrganizationProxy.GET_LIST,
        useFactory: (organizationRepo: IOrganizationRepository) => {
            return new UseCaseProxy(new GetOrganizationListUseCase(organizationRepo))
        }
    },

]
export const organizationProxyExports = [
    OrganizationProxy.GET_LIST,
]
