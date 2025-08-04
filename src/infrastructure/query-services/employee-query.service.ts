import { EntityManager } from 'typeorm';
import { UserEntity } from '@infrastructure/entities/user/user.entity';
import {BaseQueryService} from "@infrastructure/query-services/base-query.service";
import {IEmployeeQs} from "@application/interfaces/query-services/employee-qs/employee-qs.interface";
import {GetListEmployeeQuery} from "@application/use-cases/default/employee/get-list/get-employee-list.query";
import {PaginatedResult} from "@application/interfaces/query-services/common/paginated-result.interface";
import {
    QSEmployeeWithRoleDto
} from "@application/interfaces/query-services/employee-qs/dtos/response/employees-with-role.dto";
import {InjectEntityManager} from "@nestjs/typeorm";


export class EmployeeQueryService extends BaseQueryService implements IEmployeeQs {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
    ) {
        super();
    }

    async getEmployeesWithRoleList(query: GetListEmployeeQuery): Promise<PaginatedResult<QSEmployeeWithRoleDto>> {
        const { filter, pagination, sort, search } = query;

        let queryBuilder = this.manager.getRepository(UserEntity)
            .createQueryBuilder('employee')
            .leftJoin('employee.role', 'role')
            .select([
                'employee.id AS id', 'employee.name AS name', 'employee.email AS email', 'employee.phone AS phone',
                'employee.avatar AS avatar', 'employee.companyId AS companyId', 'employee.roleId AS roleId',
                'employee.createdAt AS createdAt', 'employee.updatedAt AS updatedAt', 'employee.deletedAt AS deletedAt',
                'role.name AS roleName', 'role.name AS roleDescription',
            ]);

        // Применяем фильтры
        if (filter.companyId) {
            queryBuilder = queryBuilder.andWhere('employee.companyId = :companyId', { companyId: filter.companyId });
        }
        queryBuilder = this.applySearch(queryBuilder, search, [
            'employee.name', 'employee.email', 'user.phone'
        ]);

        const allowedSortFieldsMap: Record<string, string> = {
            'id': 'employee.id', 'name': 'employee.name', 'email': 'employee.email',
            'createdAt': 'employee.createdAt', 'roleName': 'role.name',
        };
        queryBuilder = this.applySorting(queryBuilder, sort, allowedSortFieldsMap);

        // Передаем QueryBuilder<UserEntity> и тип DTO в paginate
        return this.paginate<UserEntity, QSEmployeeWithRoleDto>( // <--- Явно указываем Entity и DTO
            queryBuilder,
            pagination.page,
            pagination.limit
        );
    }
}
