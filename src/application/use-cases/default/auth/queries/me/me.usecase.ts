import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";
import {UserMeQuery} from "@application/use-cases/default/auth/queries/me/me.query";
import {IEmployeeRepository} from "@domain/employee/repositories/employee-repository.interface";
import {IManagerRepository} from "@domain/manager/repositories/manager-repository.interface";
import {Employee} from "@domain/employee/employee";
import {Manager} from "@domain/manager/manager";
import {Role} from "@domain/policy/model/role";
import {IEmployeeQs} from "@application/interfaces/query-services/employee-qs/employee-qs.interface";
import {IManagerQs} from "@application/interfaces/query-services/manager-qs/manager-qs.interface";
import {
    QSManagerWithRoleDto
} from "@application/interfaces/query-services/manager-qs/dtos/response/manager-with-role.dto";
import {
    QSEmployeeWithRoleDto
} from "@application/interfaces/query-services/employee-qs/dtos/response/employees-with-role.dto";

export class MeUseCase {
    constructor(
        private readonly employeeQs: IEmployeeQs,
        private readonly managerQS: IManagerQs,
    ) {
    }
    async execute(query: UserMeQuery): Promise<QSManagerWithRoleDto | QSEmployeeWithRoleDto> {
        let user;
        if (query.actor.role.isManager() || query.actor.role.isAdmin()) {
            user = await this.managerQS.getManagerWithRole(query.actor.id);

        } else {
            user = await this.employeeQs.getEmployeeWithRole(query.actor.id);
        }

        if (!user) {
            throw new Error(EXCEPTION.COMMON.UNAUTHORIZED);
        }
        return user;
    }
}
