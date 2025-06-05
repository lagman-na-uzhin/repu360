import type {Role} from "@domain/policy/model/role";
import {UniqueID} from "@domain/common/unique-id";

class ActorId extends UniqueID {}

export class Actor {
    private constructor(
        private readonly _id: ActorId,
        private readonly _role: Role
    ) {}

    static fromPersistence(
        actorId: string,
        role: Role,
    ): Actor {
        return new Actor(new ActorId(actorId), role);
    }

    get id() {
        return this._id;
    }

    get role() {
        return this._role;
    }
}
