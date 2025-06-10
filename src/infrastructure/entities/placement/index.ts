import {OrganizationPlacementEntity} from "@infrastructure/entities/placement/organization-placement.entity";
import {
    TwogisPlacementDetailEntity
} from "@infrastructure/entities/placement/placement-details/twogis-placement.entity";
import {
    YandexPlacementDetailEntity
} from "@infrastructure/entities/placement/placement-details/yandex-placement.entity";

export const PLACEMENT_ENTITIES = [OrganizationPlacementEntity, TwogisPlacementDetailEntity, YandexPlacementDetailEntity]
