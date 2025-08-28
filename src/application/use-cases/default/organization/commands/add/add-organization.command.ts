import {PLATFORMS} from "@domain/common/platfoms.enum";
import {BaseCommand} from "@application/common/base-command";
import {Actor} from "@domain/policy/actor";
import {CompanyId} from "@domain/company/company";
import {GroupId} from "@domain/organization/group";
import {TwogisCabinetCredentials} from "@domain/placement/value-object/twogis/twogis-cabinet-credentials.vo";

export class AddOrganizationCommand extends BaseCommand{
    constructor(
        public readonly companyId: CompanyId,
        public readonly groupId: GroupId | null,
        public readonly city: string,
        public readonly externalId: string,
        public readonly platform: PLATFORMS,
        public readonly cabinetCredentials: TwogisCabinetCredentials,

        public readonly actor: Actor,


    ) {super(actor)}

    static of(
        dto: {
            companyId: CompanyId,
            groupId: GroupId | null,
            city: string,
            externalId: string,
            platform: PLATFORMS,
            login: string,
            password: string
        },
        actor: Actor
    ) {
        const cabinetCredentials = new TwogisCabinetCredentials(dto.login, dto.password);
        return new AddOrganizationCommand(dto.companyId, dto.groupId, dto.city, dto.externalId, dto.platform, cabinetCredentials, actor)
    }
}
