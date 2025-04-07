import {Employee} from "@domain/company/model/employee/employee";

export class LoginOutput {
    constructor(
        public readonly employee: Employee,
        public readonly token: string,
        public readonly expireTime: string,
    ) {
    }
}
