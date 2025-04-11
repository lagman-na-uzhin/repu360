import {Manager} from "@domain/manager/manager";

export class BaseManagerInput {
    constructor(
        public readonly manager: Manager
    ) {}
}
