import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";
import {EmployeeMeQuery} from "@application/use-cases/default/employee/me/me.input";
import {EmployeeMeOutput} from "@application/use-cases/default/employee/me/me.output";
import {IEmployeeRepository} from "@domain/employee/repositories/employee-repository.interface";

export class MeUseCase {
    constructor(
        private readonly employeeRepo: IEmployeeRepository
    ) {
    }
    async execute(query: EmployeeMeQuery): Promise<EmployeeMeOutput> {
        const employee = await this.employeeRepo.getById(query.actor.id);

        if (!employee) {
            throw new Error(EXCEPTION.COMMON.UNAUTHORIZED);
        }

        return EmployeeMeOutput.of(
            employee.id,
            employee.name,
            query.actor.role,
            employee.companyId,
            employee.phone,
            employee.email
        );
    }
}
