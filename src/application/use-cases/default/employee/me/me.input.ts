import {BaseInput} from "@application/common/base-command/base-command";
import {Employee, EmployeeId} from "@domain/employee/employee";
import {EmployeeRole} from "@domain/employee/model/employee-role";

export class EmployeeMeInput extends BaseInput {
    private constructor(employeeRole: EmployeeRole, employeeId: EmployeeId) {
        super(employeeRole, employeeId);
    }

    static of(role: EmployeeRole, employeeId: EmployeeId) {
        return new EmployeeMeInput(role,  employeeId);
    }
}
