import {BaseInput} from "@application/common/base-input";
import {Employee} from "@domain/employee/employee";

export class EmployeeMeInput extends BaseInput {
    private constructor(employee: Employee) {
        super(employee);
    }

    static of(employee: Employee) {
        return new EmployeeMeInput(employee);
    }
}
