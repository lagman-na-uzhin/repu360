import {PLATFORMS} from "@domain/common/platfoms.enum";

export interface QSOrganizationRubricsDto {
    id: string;
    name: string;
    external: {
        name: string;
        externalId: string;
        platform: PLATFORMS
    }[]
}
