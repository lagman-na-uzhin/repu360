import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";
import {UserMeQuery} from "@application/use-cases/default/auth/queries/me/me.query";
import {IEmployeeRepository} from "@domain/employee/repositories/employee-repository.interface";
import {IManagerRepository} from "@domain/manager/repositories/manager-repository.interface";
import {Employee} from "@domain/employee/employee";
import {Manager} from "@domain/manager/manager";
import {Role} from "@domain/policy/model/role";

export class MeUseCase {
    constructor(
        private readonly employeeRepo: IEmployeeRepository,
        private readonly managerRepo: IManagerRepository,
    ) {
    }
    async execute(query: UserMeQuery): Promise<{
        user: Employee | Manager,
        role: Role
    }> {
        let user;
        if (query.actor.role.isManager() || query.actor.role.isAdmin()) {
            user = await this.managerRepo.getById(query.actor.id);

        } else {
            user = await this.employeeRepo.getById(query.actor.id);
        }

        if (!user) {
            throw new Error(EXCEPTION.COMMON.UNAUTHORIZED);
        }
        return {
            user,
            role: query.actor.role
        }
    }
}
