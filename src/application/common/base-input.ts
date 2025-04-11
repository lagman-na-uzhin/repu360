import {Employee} from "@domain/employee/employee";

export class BaseInput {
    constructor(
        public readonly employee: Employee
    ) {}
}
