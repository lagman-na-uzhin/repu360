import { EntityManager } from 'typeorm';
import {BaseQueryService} from "@infrastructure/query-services/base-query.service";
import {PaginatedResult} from "@application/interfaces/query-services/common/paginated-result.interface";
import {InjectEntityManager} from "@nestjs/typeorm";
import {IOrganizationQs} from "@application/interfaces/query-services/organization-qs/organization-qs.interface";
import {OrganizationEntity} from "@infrastructure/entities/organization/organization.entity";
import {QSOrganizationDto} from "@application/interfaces/query-services/organization-qs/dto/response/organization.dto";
import {
    QSOrganizationCompactDto
} from "@application/interfaces/query-services/organization-qs/dto/response/organization-compact.dto";
import {
    GetOrganizationListQuery
} from "@application/use-cases/default/organization/queries/get-list-by-company/get-list-by-company.query";
import {
    GetCompactOrganizationQuery
} from "@application/use-cases/default/organization/queries/get-organization-compact/get-compact-organization.query";
import {
    QSOrganizationSummaryDto
} from "@application/interfaces/query-services/organization-qs/dto/response/organizarion-summaty.dto";
import {GetSummaryQuery} from "@application/use-cases/default/organization/queries/get-summary/get-summary.query";


export class OrganizationQueryService extends BaseQueryService implements IOrganizationQs {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
    ) {
        super();
    }

    async getList(query: GetOrganizationListQuery): Promise<PaginatedResult<QSOrganizationDto>> {
        const { filter, pagination, sort, search } = query;

        let queryBuilder = this.manager.getRepository(OrganizationEntity)
            .createQueryBuilder('org')
            .leftJoinAndSelect('org.workingSchedule', 'schedule')
            .leftJoinAndSelect('schedule.entries', 'scheduleEntries')
            .leftJoinAndSelect('org.rubrics', 'rubrics')
            .leftJoinAndSelect('rubrics.external', 'external')
            .leftJoinAndSelect('org.placements', 'placements')
            .leftJoinAndSelect('org.address', 'address')
            .leftJoinAndSelect('org.group', 'group');

        queryBuilder = queryBuilder.andWhere('org.companyId = :companyId', { companyId: filter!.companyId });

        if (filter?.isTemporarilyClosed) {
            queryBuilder = queryBuilder.andWhere('org.isTemporarilyClosed = :isTemporarilyClosed', { isTemporarilyClosed: filter.isTemporarilyClosed });
        }

        if (filter?.isActive) {
            queryBuilder.andWhere('org.isActive = :isActive', { isActive: filter.isActive });
        }

        queryBuilder = this.applySearch(queryBuilder, search, [
            'org.name', 'org.address'
        ]);

        const allowedSortFieldsMap: Record<string, string> = {
            'id': 'org.id',
            'name': 'org.name',
            'isTemporarilyClosed': 'org.isTemporarilyClosed',
            'companyId': 'org.companyId',
            'createdAt': 'org.createdAt',
            'updatedAt': 'org.updatedAt',
            'city': 'org.address.city',
        };
        queryBuilder = this.applySorting(queryBuilder, sort, allowedSortFieldsMap);

        const [organizations, total] = await queryBuilder
            .skip((pagination.page - 1) * pagination.limit)
            .take(pagination.limit)
            .getManyAndCount();

        const totalPages = Math.ceil(total / pagination.limit);


        console.log(organizations, "working")
        const list: QSOrganizationDto[] = organizations.map(org => ({
            id: org.id,
            name: org.name,
            group: org.group?.id ? {id: org.group.id, name: org.group.name} : null,
            address: {
                city: org.address.city,
                addressName: `${org.address.street}, ${org.address.housenumber}`,
                latitude: org.address.latitude,
                longitude: org.address.longitude
            },
            companyId: org.companyId,
            createdAt: org.createdAt,
            updatedAt: org.updatedAt,

            workingSchedule:
                org.workingSchedule
                    ? {
                        isTemporaryClosed: org.workingSchedule.isTemporaryClosed,
                        entries: org.workingSchedule.entries?.map(schedule => ({
                                dayOfWeek: schedule.dayOfWeek,
                                startTime: schedule.startTime,
                                endTime: schedule.endTime,
                                breakStartTime: schedule.breakStartTime,
                                breakEndTime: schedule.breakEndTime
                                })) || []
                        }
                        : null,
            rubrics: org.rubrics?.map(rubric => ({
                id: rubric.id,
                name: rubric.name,
                external: rubric?.external.map(e => {
                    return {
                        name: e.name,
                        externalId: e.externalId,
                        platform: e.platform
                    }
                }) ?? []
            })) ?? [],
            placements: org.placements?.map(placement => ({
                id: placement.id,
                externalId: placement.externalId,
                platform: placement.platform,
                rating: placement.rating
            })) ?? [],
        }));

        return {
            list,
            total,
            totalPages,
            currentPage: pagination.page,
            limit: pagination.limit,
        };
    }

    async getCompactOrganizations(query: GetCompactOrganizationQuery): Promise<QSOrganizationCompactDto[]> {
        const { companyId } = query;

        const organizations = await this.manager.getRepository(OrganizationEntity)
            .createQueryBuilder('org')
            .leftJoinAndSelect('org.address', 'address')
            .leftJoinAndSelect('org.group', 'group')
            .where('org.companyId = :companyId', { companyId: companyId.toString() })
            .select([
                'org.id',
                'org.name',
                'org.companyId',
                'group.id',
                'group.name',
                'address.city',
                'address.address',
                'address.latitude',
                'address.longitude',
            ])
            .getMany();

        return organizations.map(org => ({
            id: org.id,
            name: org.name,
            group: org.group?.id ? {id: org.group.id, name: org.group.name} : null,
            companyId: org.companyId,
            address: {
                city: org.address.city,
                addressName: `${org.address.street}, ${org.address.housenumber}`,
                longitude: org.address.longitude,
                latitude: org.address.latitude
            },
        }));
    }

    async getSummary(query: GetSummaryQuery): Promise<QSOrganizationSummaryDto> {
        const { companyId } = query;

        const baseQuery = this.manager
            .getRepository(OrganizationEntity)
            .createQueryBuilder('organization')
            .where('organization.companyId = :companyId', { companyId });

        const total = await baseQuery.getCount();

        const active = await baseQuery
            .andWhere('organization.isActive = :isActive', { isActive: true })
            .getCount();

        return {
            total,
            active,
        };
    }
}
