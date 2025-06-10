import {CompanyId} from "@domain/company/company";
import {BaseCommand} from "@application/common/base-command";
import {Actor} from "@domain/policy/actor";
import {CompanyName} from "@domain/company/value-object/company-name.vo";

export class UpdateCompanyCommand extends BaseCommand {
    constructor(
        public readonly companyId: CompanyId,
        public readonly name: CompanyName,
        actor: Actor
    ) {super(actor)}

    static of(dto: {companyId: string, name: string}, actor: Actor) {
        return new UpdateCompanyCommand(new CompanyId(dto.companyId), new CompanyName(dto.name), actor);
    }
}
