import {PLATFORMS} from "@domain/common/platfoms.enum";
import {BaseCommand} from "@application/common/base-command";
import {Actor} from "@domain/policy/actor";
import {CompanyId} from "@domain/company/company";
import {GroupId} from "@domain/organization/group";

export class AddOrganizationCommand extends BaseCommand{
    constructor(
        public readonly companyId: CompanyId,
        public readonly groupId: GroupId | null,
        public readonly city: string,
        public readonly externalId: string,
        public readonly platform: PLATFORMS,

        public readonly actor: Actor,


    ) {super(actor)}

    static of(
        dto: {
            companyId: CompanyId,
            groupId: GroupId | null,
            city: string,
            externalId: string
            platform: PLATFORMS
        },
        actor: Actor
    ) {
        return new AddOrganizationCommand(dto.companyId, dto.groupId, dto.city, dto.externalId, dto.platform, actor)
    }
}
