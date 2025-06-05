import {Manager} from "@domain/manager/manager";
import {Role} from "@domain/policy/model/role";

export class ManagerLoginOutput {
    constructor(
        public readonly manager: {
            id: string,
            email: string,
            name: string,
            phone: string,
            role: {
                id: string,
                name: string | null,
                type: string,
                permissions: {
                    companies: string[]
                }
            }
        },
        public readonly token: string,
        public readonly expireTime: string,
    ) {}

    static of(manager: Manager, role: Role, token: string, expireTime: string): ManagerLoginOutput {
        return new ManagerLoginOutput(
            {
                id: manager.id.toString(),
                email: manager.email.toString(),
                name: manager.name.toString(),
                phone: manager.phone.toString(),
                role: {
                    id: role.id.toString(),
                    name: role.name,
                    type: role.type.toString(),
                    permissions: {
                        companies: Array.from(role.managerPermissions.companies)
                    }
                }
            },
            token,
            expireTime
        );
    }
}
