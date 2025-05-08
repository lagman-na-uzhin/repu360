import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";
import {UserMeQuery} from "@application/use-cases/default/auth/queries/me/me.query";
import {UserMeOutput} from "@application/use-cases/default/auth/queries/me/me.output";
import {IEmployeeRepository} from "@domain/employee/repositories/employee-repository.interface";
import {IManagerRepository} from "@domain/manager/repositories/manager-repository.interface";

export class MeUseCase {
    constructor(
        private readonly employeeRepo: IEmployeeRepository,
        private readonly managerRepo: IManagerRepository,
    ) {
    }
    async execute(query: UserMeQuery): Promise<UserMeOutput> {
        let user;
        if (query.actor.role.isManager() || query.actor.role.isAdmin()) {
            user = await this.managerRepo.getById(query.actor.id);

        } else {
            user = await this.employeeRepo.getById(query.actor.id);
        }

        if (!user) {
            throw new Error(EXCEPTION.COMMON.UNAUTHORIZED);
        }

        const res = UserMeOutput.of(
            user.id,
            user.name,
            query.actor.role,
            user.companyId,
            user.phone,
            user.email
        );
        console.log(res, "res")
        return res;
    }
}
