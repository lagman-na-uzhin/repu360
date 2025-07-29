import {IEmployeeQs} from "@application/interfaces/query-services/employee-qs/employee-qs.interface";
import {PaginatedResult} from "@application/interfaces/query-services/common/paginated-result.interface";
import {QSEmployeeWithRoleDto} from "@application/interfaces/query-services/employee-qs/dtos/response/employees-with-role.dto";
import {BaseQueryService} from "@infrastructure/query-services/base-query.service";
import {CompanyId} from "@domain/company/company";
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager} from "typeorm";
import {UserEntity} from "@infrastructure/entities/user/user.entity";
import {GetListEmployeeQuery} from "@application/use-cases/default/employee/get-list/get-employee-list.query";

export class EmployeeQueryService
    extends BaseQueryService
    implements IEmployeeQs {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
    ) {
        super();
    }

    async getEmployeesWithRoleList(query: GetListEmployeeQuery): Promise<PaginatedResult<QSEmployeeWithRoleDto>> {
        const {filter, pagination} = query;

        let queryBuilder = this.manager.getRepository(UserEntity)
            .createQueryBuilder('employee')
            .leftJoin('Role', 'role', 'employee.roleId = role.id')
            .select([
                'employee.id',
                'employee.firstName',
                'employee.lastName',
                'employee.email',
                'employee.roleId',
                'employee.hireDate',
                'employee.department',
                'role.name AS roleName',
                'role.description AS roleDescription',
            ])
            .where('employee.companyId = :companyId', {companyId: filter.companyId.toString()})

        return this.paginateQuery<QSEmployeeWithRoleDto>(queryBuilder, pagination.page, pagination.limit)
    }
}
