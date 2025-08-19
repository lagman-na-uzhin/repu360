import {PLATFORMS} from "@domain/common/platfoms.enum";

export interface QSOrganizationPlacementDto {
    id: string;
    externalId: string;
    platform: PLATFORMS;
    rating: number,
    yandexRating?: number | null;
    twogisRating?: number | null;
}
