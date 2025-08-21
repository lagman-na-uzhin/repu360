import {BaseQueryService} from "@infrastructure/query-services/base-query.service";
import {IEmployeeQs} from "@application/interfaces/query-services/employee-qs/employee-qs.interface";
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager} from "typeorm";
import {IManagerQs} from "@application/interfaces/query-services/manager-qs/manager-qs.interface";
import {ManagerId} from "@domain/manager/manager";
import {
    QSManagerWithRoleDto
} from "@application/interfaces/query-services/manager-qs/dtos/response/manager-with-role.dto";
import {UserEntity} from "@infrastructure/entities/user/user.entity";
import {
    QSManagerRoleDto,
    QSManagerRolePermission
} from "@application/interfaces/query-services/manager-qs/dtos/response/manager-role.dto";

export class ManagerQueryService extends BaseQueryService implements IManagerQs {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
    ) {
        super();
    }
    async getManagerWithRole(managerId: ManagerId): Promise<QSManagerWithRoleDto | null> {
        const result = await this.manager.getRepository(UserEntity)
            .createQueryBuilder('manager')
            .leftJoinAndSelect('manager.role', 'role')
            .leftJoinAndSelect('role.permissions', 'permissions')
            .where('manager.companyId IS NULL') //manager
            .andWhere('manager.id = :id', {id: managerId.toString()})
            .getOne();

        console.log(result, "result")
        return result
            ? {
                id: result.id,
                name: result.name,
                email: result.email,
                phone: result.phone,
                avatar: result.avatar,

                role: {
                    id: result.role.id,
                    name: result.role.name,
                    type: result.role.type,
                    permissions: result.role.permissions.map(p => {

                        return {
                            id: p.id,
                            module: p.module,
                            permission: p.permission
                        } as QSManagerRolePermission;

                    })
                } as QSManagerRoleDto

            } as QSManagerWithRoleDto

            : null
    }
}
