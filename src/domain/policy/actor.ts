// import {
//     ManagerCompanyPermission
// } from "@domain/manager/value-object/manager-employee-permissions/manager-company-employee-permissions.vo";
//
// class Permission {
//     constructor(
//         public readonly module: string,
//         public readonly permission: string,
//         public readonly organizationId: string | null
//     ) {}
// }
//
// class EmployeePermissions {
//     constructor(
//         public readonly reviews: Permission[],
//         public readonly companies: Permission[],
//     ) {}
// }
//
// class Role {
//     constructor(
//         public readonly type: string,
//         public readonly employee-permissions: EmployeePermissions
//     ) {}
// }
//
// type PermissionProps = {
//     module: string;
//     permission: string;
//     organizationId: string | null;
// };

import {Role} from "@domain/policy/model/role";
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
