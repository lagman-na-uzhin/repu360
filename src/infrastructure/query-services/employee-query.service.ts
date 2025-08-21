import { EntityManager } from 'typeorm';
import { UserEntity } from '@infrastructure/entities/user/user.entity';
import {BaseQueryService} from "@infrastructure/query-services/base-query.service";
import {IEmployeeQs} from "@application/interfaces/query-services/employee-qs/employee-qs.interface";
import {GetListEmployeeQuery} from "@application/use-cases/default/employee/queries/get-list/get-employee-list.query";
import {PaginatedResult} from "@application/interfaces/query-services/common/paginated-result.interface";
import {
    QSEmployeeWithRoleDto
} from "@application/interfaces/query-services/employee-qs/dtos/response/employees-with-role.dto";
import {InjectEntityManager} from "@nestjs/typeorm";
import {QSOrganizationDto} from "@application/interfaces/query-services/organization-qs/dto/response/organization.dto";
import {CompanyId} from "@domain/company/company";
import {
    QSEmployeeRoleDto,
    QSEmployeeRolePermission
} from "@application/interfaces/query-services/employee-qs/dtos/response/employee-role.dto";
import {UserRoleEntity} from "@infrastructure/entities/user/access/user-role.entity";
import {EmployeeId} from "@domain/employee/employee";
import {
    QSManagerRoleDto,
    QSManagerRolePermission
} from "@application/interfaces/query-services/manager-qs/dtos/response/manager-role.dto";
import {
    QSManagerWithRoleDto
} from "@application/interfaces/query-services/manager-qs/dtos/response/manager-with-role.dto";


export class EmployeeQueryService extends BaseQueryService implements IEmployeeQs {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
    ) {
        super();
    }

    async getEmployeeWithRole(employeeId: EmployeeId): Promise<QSEmployeeWithRoleDto | null> {
        const result = await this.manager.getRepository(UserEntity)
            .createQueryBuilder('employee')
            .leftJoinAndSelect('employee.role', 'role')
            .leftJoinAndSelect('role.permissions', 'permissions')
            .where('employee.companyId IS NOT NULL') //employee
            .andWhere('employee.id = :id', {id: employeeId.toString()})
            .getOne();

        console.log(result, "result")
        return result
            ? {
                id: result.id,
                name: result.name,
                email: result.email,
                phone: result.phone,
                avatar: result.avatar,
                companyId: result.companyId,

                role: {
                    id: result.role.id,
                    name: result.role.name,
                    type: result.role.type,
                    permissions: result.role.permissions.map(p => {

                        return {
                            id: p.id,
                            module: p.module,
                            permission: p.permission
                        } as QSEmployeeRolePermission;

                    })
                } as QSEmployeeRoleDto

            } as QSEmployeeWithRoleDto

            : null
    }

    async getEmployeesWithRoleList(query: GetListEmployeeQuery): Promise<PaginatedResult<QSEmployeeWithRoleDto>> {
        const { filter, pagination, sort, search } = query;

        let queryBuilder = this.manager.getRepository(UserEntity)
            .createQueryBuilder('employee')
            .leftJoinAndSelect('employee.role', 'role')
            .leftJoinAndSelect('role.permissions', 'permissions')

        if (filter.companyId) {
            queryBuilder = queryBuilder.andWhere('employee.companyId = :companyId', { companyId: filter.companyId.toString() });
        }
        queryBuilder = this.applySearch(queryBuilder, search, [
            'employee.name', 'employee.mail', 'employee.phone'
        ]);

        const allowedSortFieldsMap: Record<string, string> = {
            'id': 'employee.id', 'name': 'employee.name', 'email': 'employee.mail',
            'createdAt': 'employee.createdAt', 'roleName': 'role.name',
        };
        queryBuilder = this.applySorting(queryBuilder, sort, allowedSortFieldsMap);

        const [employees, total] = await queryBuilder
            .skip((pagination.page - 1) * pagination.limit)
            .take(pagination.limit)
            .getManyAndCount();

        const totalPages = Math.ceil(total / pagination.limit);

        const list: QSEmployeeWithRoleDto[] = employees.map(employee => ({
            id: employee.id,
            name: employee.name,
            email: employee.email,
            phone: employee.phone,
            avatar: employee.avatar,
            companyId: employee.companyId,

            role: {
                id: employee.role.id,
                name: employee.role?.name || null,
                type: employee.role.type as "OWNER" | "EMPLOYEE",
                permissions: employee.role.permissions.map(p => ({
                    id: p.id,
                    module: p.module as "COMPANIES" | "REVIEWS" | "ORGANIZATIONS" | "EMPLOYEES",
                    permission: p.permission,
                })),
            },
            createdAt: employee.createdAt,
            updatedAt: employee.updatedAt,
            deletedAt: employee.deletedAt,
        }));

        return {
            list,
            total,
            totalPages,
            currentPage: pagination.page,
            limit: pagination.limit,
        };
    }


    async getEmployeeRoles(companyId: CompanyId): Promise<QSEmployeeRoleDto[]> {
        const roles = await this.manager.getRepository(UserRoleEntity)
            .createQueryBuilder('role')
            .leftJoinAndSelect('role.permissions', 'permissions')
            .leftJoin('role.users', 'employees')
            .where('employees.companyId = :companyId', {companyId: companyId.toString()})
            .getMany();

        return roles.map(role => {
            return {
                id: role.id,
                name: role.name,
                type: role.type,
                permissions: role.permissions.map(p => {
                    return {
                        id: p.id,
                        module: p.module,
                        permission: p.permission
                    } as QSEmployeeRolePermission
                })
            } as QSEmployeeRoleDto
        })

    }
}
