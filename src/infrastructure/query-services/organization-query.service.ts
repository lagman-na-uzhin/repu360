import { EntityManager } from 'typeorm';
import {BaseQueryService} from "@infrastructure/query-services/base-query.service";
import {PaginatedResult} from "@application/interfaces/query-services/common/paginated-result.interface";
import {InjectEntityManager} from "@nestjs/typeorm";
import {IOrganizationQs} from "@application/interfaces/query-services/organization-qs/organization-qs.interface";
import {GetOrganizationListByCompanyParams} from "@domain/organization/repositories/params/get-list-by-company.params";
import {OrganizationEntity} from "@infrastructure/entities/organization/organization.entity";
import {QSOrganizationDto} from "@application/interfaces/query-services/organization-qs/dto/response/organization.dto";


export class OrganizationQueryService extends BaseQueryService implements IOrganizationQs {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
    ) {
        super();
    }

    async getList(dto: GetOrganizationListByCompanyParams): Promise<PaginatedResult<QSOrganizationDto>> {
        const { filter, pagination, sort, search } = dto;

        let queryBuilder = this.manager.getRepository(OrganizationEntity)
            .createQueryBuilder('org')
            .leftJoinAndSelect('org.workingSchedules', 'schedules')
            .leftJoinAndSelect('org.rubrics', 'rubrics')
            .leftJoinAndSelect('org.placements', 'placements');

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
            'address': 'org.address',
            'isTemporarilyClosed': 'org.isTemporarilyClosed',
            'companyId': 'org.companyId',
            'createdAt': 'org.createdAt',
            'updatedAt': 'org.updatedAt',
        };
        queryBuilder = this.applySorting(queryBuilder, sort, allowedSortFieldsMap);

        const [organizations, total] = await queryBuilder
            .skip((pagination.page - 1) * pagination.limit)
            .take(pagination.limit)
            .getManyAndCount();

        const totalPages = Math.ceil(total / pagination.limit);

        const list: QSOrganizationDto[] = organizations.map(org => ({
            id: org.id,
            name: org.name,
            address: org.address,
            isTemporarilyClosed: org.isTemporarilyClosed,
            companyId: org.companyId,
            createdAt: org.createdAt,
            updatedAt: org.updatedAt,

            workingSchedules: org.workingSchedules?.map(schedule => ({
                dayOfWeek: schedule.dayOfWeek,
                startTime: schedule.startTime,
                endTime: schedule.endTime,
                breakStartTime: schedule.breakStartTime,
                breakEndTime: schedule.breakEndTime,
            })) ?? [],
            rubrics: org.rubrics?.map(rubric => ({
                alias: rubric.alias,
                name: rubric.name,
                type: rubric.type,
            })) ?? [],
            placements: org.placements?.map(placement => ({
                id: placement.id,
                externalId: placement.externalId,
                platform: placement.platform,
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
}
