import {UserId} from "@domain/manager/manager";

export class UserMeInput {
    constructor(
        public readonly authId: UserId,
    ) {}
}
