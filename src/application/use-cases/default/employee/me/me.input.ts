import {EmployeeId} from "@domain/employee/employee";

export class UserMeInput {
    constructor(
        public readonly authId: EmployeeId,
    ) {}
}
