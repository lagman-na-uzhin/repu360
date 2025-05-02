import { PREFIX } from 'src/infrastructure/usecase-proxy/prefix';
import { UseCaseProxy } from 'src/infrastructure/usecase-proxy/usecase-proxy';
import {IOrganizationRepository} from "@domain/organization/repositories/organization-repository.interface";
import {
    GetOrganizationListUseCase
} from "@application/use-cases/default/organization/queries/get-list-by-company/get-list-by-company.usecase";
import {OrganizationOrmRepository} from "@infrastructure/repositories/organization/organization.repository";

export const OrganizationProxy = {
    //DEFAULT
    "GET_LIST": `${PREFIX.USER_PROXY}GetOrganizationListUseCaseProxy`,
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
