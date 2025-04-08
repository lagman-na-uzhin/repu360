import {Employee} from "@domain/employee/employee";

export class LoginOutput {
    constructor(
        public readonly employee: Employee,
        public readonly token: string,
        public readonly expireTime: string,
    ) {
    }
}
