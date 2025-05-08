import {Manager} from "@domain/manager/manager";

export class ManagerLoginOutput {
    constructor(
        public readonly manager: Manager,
        public readonly token: string,
        public readonly expireTime: string,
    ) {
    }
}
