import type {Role} from "@domain/policy/model/role";
import {UniqueID} from "@domain/common/unique-id";
import {CompanyId} from "@domain/company/company";

class ActorId extends UniqueID {}

export class Actor {
    private constructor(
        private readonly _id: ActorId,
        private readonly _companyId: CompanyId | null,
        private readonly _role: Role
    ) {}

    static fromPersistence(
        actorId: string,
        companyId: string | null,
        role: Role,
    ): Actor {
        return new Actor(
            new ActorId(actorId),
            companyId ? new CompanyId(companyId) : null,
            role
        );
    }

    get id() {
        return this._id;
    }

    get role() {
        return this._role;
    }

    get companyId() {
        return this._companyId;
    }
}
