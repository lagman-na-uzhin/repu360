import {IOrganizationRepository} from "@domain/organization/repositories/organization-repository.interface";
import {
    GetOrganizationListUseCase
} from "@application/use-cases/default/organization/queries/get-list-by-company/get-list-by-company.usecase";
import {OrganizationOrmRepository} from "@infrastructure/repositories/organization/organization.repository";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {OrganizationProxy} from "@application/use-case-proxies/organization/organization.proxy";
import {
    AddOrganizationUseCase
} from "@application/use-cases/default/organization/commands/add/add-organization.usecase";
import {ICompanyRepository} from "@domain/company/repositories/company-repository.interface";
import {IPlacementRepository} from "@domain/placement/repositories/placement-repository.interface";
import {IUnitOfWork} from "@application/interfaces/services/unitOfWork/unit-of-work.interface";
import {CompanyOrmRepository} from "@infrastructure/repositories/company/company.repository";
import {PlacementOrmRepository} from "@infrastructure/repositories/placement/placement.repository";
import {UnitOfWork} from "@infrastructure/services/unit-of-work/unit-of-work.service";
import {ITwogisSession} from "@application/interfaces/integrations/twogis/twogis-session.interface";
import {ProxySessionProxy} from "@infrastructure/providers/proxy-session/proxy-session.providers";
import {IOrganizationQs} from "@application/interfaces/query-services/organization-qs/organization-qs.interface";
import {OrganizationQueryService} from "@infrastructure/query-services/organization-query.service";
import {
    GetCompactOrganizationsUseCase
} from "@application/use-cases/default/organization/queries/get-organization-compact/get-compact-organizations.usecase";
import {GetSummaryUseCase} from "@application/use-cases/default/organization/queries/get-summary/get-summary.usecase";


export const organizationProxyProviders = [
    {
        inject: [OrganizationQueryService],
        provide: OrganizationProxy.GET_LIST,
        useFactory: (organizationQs: IOrganizationQs) => {
            return new UseCaseProxy(new GetOrganizationListUseCase(organizationQs))
        }
    },

    {
        inject: [CompanyOrmRepository, OrganizationOrmRepository, PlacementOrmRepository, UnitOfWork,   ProxySessionProxy.TWOGIS_SESSION],
        provide: OrganizationProxy.ADD,
        useFactory: (
            companyRepo: ICompanyRepository,
            organizationRepo: IOrganizationRepository,
            placementRepo: IPlacementRepository,
            uof: IUnitOfWork,
            twogisSession: ITwogisSession
        ) => {
            return new UseCaseProxy(new AddOrganizationUseCase(
                companyRepo,
                organizationRepo,
                placementRepo,
                uof,
                twogisSession
            ))
        }
    },

    {
        inject: [OrganizationQueryService],
        provide: OrganizationProxy.COMPACT_ORGANIZATIONS,
        useFactory: (organizationQs: IOrganizationQs) => {
            return new UseCaseProxy(new GetCompactOrganizationsUseCase(organizationQs))
        }
    },

    {
        inject: [OrganizationQueryService],
        provide: OrganizationProxy.GET_SUMMARY,
        useFactory: (organizationQs: IOrganizationQs) => {
            return new UseCaseProxy(new GetSummaryUseCase(organizationQs))
        }
    },
]

