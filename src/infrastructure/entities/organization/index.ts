import { OrganizationEntity } from '@infrastructure/entities/organization/organization.entity';
import { OrganizationPlacementEntity } from '@infrastructure/entities/placement/organization-placement.entity';
import {
  TwogisPlacementDetailEntity,
} from '@infrastructure/entities/placement/placement-details/twogis-placement.entity';
import {
  YandexPlacementDetailEntity,
} from '@infrastructure/entities/placement/placement-details/yandex-placement.entity';

export const ORGANIZATION_ENTITIES = [
  OrganizationEntity,
  OrganizationPlacementEntity,
  TwogisPlacementDetailEntity,
  YandexPlacementDetailEntity

]
