import {IOrganizationRepository} from "@domain/organization/repositories/organization-repository.interface";
import {
    GetOrganizationListUseCase
} from "@application/use-cases/default/organization/queries/get-list-by-company/get-list-by-company.usecase";
import {OrganizationOrmRepository} from "@infrastructure/repositories/organization/organization.repository";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {OrganizationProxy} from "@application/use-case-proxies/organization/organization.proxy";
import {
    GetUserPermittedOrganizationListUseCase
} from "@application/use-cases/default/organization/queries/get-list-by-user/get-list-by-user.usecase";
import {
    AddOrganizationUseCase
} from "@application/use-cases/default/organization/commands/add/add-organization.usecase";
import {ICompanyRepository} from "@domain/company/repositories/company-repository.interface";
import {IPlacementRepository} from "@domain/placement/repositories/placement-repository.interface";
import {IUnitOfWork} from "@application/interfaces/services/unitOfWork/unit-of-work.interface";
import {CompanyOrmRepository} from "@infrastructure/repositories/company/company.repository";
import {PlacementOrmRepository} from "@infrastructure/repositories/placement/placement.repository";
import {UnitOfWork} from "@infrastructure/services/unit-of-work/unit-of-work.service";


export const organizationProxyProviders = [
    {
        inject: [OrganizationOrmRepository],
        provide: OrganizationProxy.GET_LIST,
        useFactory: (organizationRepo: IOrganizationRepository) => {
            return new UseCaseProxy(new GetOrganizationListUseCase(organizationRepo))
        }
    },

    {
        inject: [OrganizationOrmRepository],
        provide: OrganizationProxy.GET_USER_PERMITTED_ORGANIZATIONS_LIST,
        useFactory: (organizationRepo: IOrganizationRepository) => {
            return new UseCaseProxy(new GetUserPermittedOrganizationListUseCase(organizationRepo))
        }
    },

    {
        inject: [CompanyOrmRepository, OrganizationOrmRepository, PlacementOrmRepository, UnitOfWork],
        provide: OrganizationProxy.ADD,
        useFactory: (
            companyRepo: ICompanyRepository,
            organizationRepo: IOrganizationRepository,
            placementRepo: IPlacementRepository,
            uof: IUnitOfWork
        ) => {
            return new UseCaseProxy(new AddOrganizationUseCase(
                companyRepo,
                organizationRepo,
                placementRepo,
                uof
            ))
        }
    },
]

