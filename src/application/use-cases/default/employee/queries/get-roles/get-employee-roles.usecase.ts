import {IEmployeeQs} from "@application/interfaces/query-services/employee-qs/employee-qs.interface";
import {GetEmployeeRolesQuery} from "@application/use-cases/default/employee/queries/get-roles/get-employee-roles.query";

export class GetEmployeeRolesUseCase {
    constructor(
        private readonly employeeQueryService: IEmployeeQs
    ) {}

    async execute(query: GetEmployeeRolesQuery) {
        return this.employeeQueryService.getEmployeeRoles(query.companyId);
    }
}
