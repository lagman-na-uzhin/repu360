import {OrganizationId} from "@domain/organization/organization";
import {Platform} from "@domain/placement/types/platfoms.enum";

export class TwogisAddPlacementCommand {
    constructor(
        public readonly organizationId: OrganizationId,
        public readonly platform: Platform,
        public readonly externalId: string,
        public readonly type: string,
        public readonly cabinetLogin: string,
        public readonly cabinetPassword: string,
    ) {}
}
