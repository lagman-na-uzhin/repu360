import {Manager} from "@domain/manager/manager";

export class LoginOutput {
    constructor(
        public readonly user: Manager,
        public readonly token: string,
        public readonly expireTime: string,
    ) {
    }
}
