import {BaseCommand} from "@application/common/base-command";
import {Actor} from "@domain/policy/actor";

export class CreateEmployeeRoleCommand extends BaseCommand {
    constructor(
        public readonly name: string,
        public readonly permissions: {module: string, permission: string, organizationId?: string}[],
        actor: Actor
    ) {super(actor)}

    static of(
        dto: {name: string, permissions: {module: string, permission: string, organizationId?: string}[]},
        actor: Actor
    ) {
        return new CreateEmployeeRoleCommand(dto.name, dto.permissions, actor);
    }
}
