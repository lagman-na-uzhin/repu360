import {IOrganizationRepository} from "@domain/organization/repositories/organization-repository.interface";
import {
    GetOrganizationListUseCase
} from "@application/use-cases/default/organization/queries/get-list-by-company/get-list-by-company.usecase";
import {OrganizationOrmRepository} from "@infrastructure/repositories/organization/organization.repository";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {OrganizationProxy} from "@application/use-case-proxies/organization/organization.proxy";


export const organizationProxyProviders = [
    {
        inject: [OrganizationOrmRepository],
        provide: OrganizationProxy.GET_LIST,
        useFactory: (organizationRepo: IOrganizationRepository) => {
            return new UseCaseProxy(new GetOrganizationListUseCase(organizationRepo))
        }
    },

]

