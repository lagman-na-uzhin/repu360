import {PLATFORMS} from "@domain/common/platfoms.enum";
import {BaseCommand} from "@application/common/base-command";
import {Actor} from "@domain/policy/actor";
import {CompanyId} from "@domain/company/company";
class PlacementCommand {
    constructor(
        public readonly externalId: string,
        public readonly platform: PLATFORMS,
        public readonly addressName: string,
        public readonly type: string,
    ) {}
}
export class AddOrganizationCommand extends BaseCommand{
    constructor(
        public readonly companyId: CompanyId,
        public readonly name: string,
        public readonly address: string,
        public readonly placements: PlacementCommand[] ,

        public readonly actor: Actor,


    ) {super(actor)}

    static of(
        dto: {
            companyId: CompanyId,
            name: string,
            address: string,
            placements: {
                externalId: string
                platform: PLATFORMS
                addressName: string
                type: string
            }[]
        },
        actor: Actor
    ) {
        const placements = dto.placements.map(p => new PlacementCommand(p.externalId, p.platform, p.addressName, p.type))
        return new AddOrganizationCommand(dto.companyId, dto.name, dto.address, placements, actor)
    }
}
