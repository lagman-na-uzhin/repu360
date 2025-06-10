
import {ProfileEntity} from "@infrastructure/entities/profile/profile.entity";
import {
    TwogisProfilePlacementDetailEntity
} from "@infrastructure/entities/profile/placement-details/twogis-profile.entity";
import {
    YandexProfilePlacementDetailEntity
} from "@infrastructure/entities/profile/placement-details/yandex-profile.entity";

export const PROFILE_ENTITIES = [ProfileEntity, TwogisProfilePlacementDetailEntity, YandexProfilePlacementDetailEntity]
