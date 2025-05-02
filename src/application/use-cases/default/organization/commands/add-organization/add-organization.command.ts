import {CompanyId} from "@domain/company/company";
import {BaseCommand} from "@application/common/base-command";
import {Actor} from "@domain/policy/actor";

export class AddOrganizationCommand extends BaseCommand {
    constructor(
        public readonly companyId: CompanyId,
        public readonly name: string,
        actor: Actor
    ) {super(actor)}

    static of(dto: {companyId: CompanyId, name: string}, actor: Actor) {
        return new AddOrganizationCommand(dto.companyId, dto.name, actor);
    }
}
