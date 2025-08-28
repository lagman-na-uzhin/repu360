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
import {
    SyncOrganizationScheduleUseCase
} from "@application/use-cases/background/organization/sync-organization/sync-organization-sh.usecase";
import {IRubricRepository} from "@domain/rubric/repositories/rubric-repository.interface";
import {RubricOrmRepository} from "@infrastructure/repositories/rubric/rubric-repository";
import {
    UpdateOrganizationUseCase
} from "@application/use-cases/default/organization/commands/update/update-organization.usecase";
import {IGeocoderService} from "@application/interfaces/services/geocoder/geocoder-service.interface";
import {GeocoderService} from "@infrastructure/services/geocoder/geocoder.service";


export const organizationProxyProviders = [
    {
        inject: [OrganizationQueryService],
        provide: OrganizationProxy.GET_LIST,
        useFactory: (organizationQs: IOrganizationQs) => {
            return new UseCaseProxy(new GetOrganizationListUseCase(organizationQs))
        }
    },

    {
        inject: [CompanyOrmRepository, PlacementOrmRepository, UnitOfWork, ProxySessionProxy.TWOGIS_SESSION, GeocoderService],
        provide: OrganizationProxy.ADD,
        useFactory: (
            companyRepo: ICompanyRepository,
            placementRepo: IPlacementRepository,
            uof: IUnitOfWork,
            twogisSession: ITwogisSession,
            geocoderService: IGeocoderService
        ) => {
            return new UseCaseProxy(new AddOrganizationUseCase(
                companyRepo,
                placementRepo,
                uof,
                twogisSession,
                geocoderService
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

    {
        inject: [OrganizationOrmRepository, RubricOrmRepository, UnitOfWork],
        provide: OrganizationProxy.UPDATE,
        useFactory: (organizationRepo: IOrganizationRepository, rubricRepo: IRubricRepository, uof: IUnitOfWork) => {
            return new UseCaseProxy(new UpdateOrganizationUseCase(organizationRepo, rubricRepo, uof))
        }
    },


    //BACKGROUND

    {
        inject: [PlacementOrmRepository, ProxySessionProxy.TWOGIS_SESSION, OrganizationOrmRepository, RubricOrmRepository],
        provide: OrganizationProxy.SYNC_SCHEDULE,
        useFactory: (
            placementRepo: IPlacementRepository,
            twogisSession: ITwogisSession,
            organizationRepo: IOrganizationRepository,
            rubricRepo: IRubricRepository
        ) => {
            return new UseCaseProxy(new SyncOrganizationScheduleUseCase(
                placementRepo,
                twogisSession,
                organizationRepo,
                rubricRepo
            ))
        }
    },
]

