import { OrganizationEntity } from '@infrastructure/entities/organization/organization.entity';
import {OrganizationGroupEntity} from "@infrastructure/entities/organization/group.entity";
import {WorkingScheduleEntryEntity} from "@infrastructure/entities/organization/working-schedule.entity";
import {ContactPointEntity} from "@infrastructure/entities/organization/contact-point.entity";
export const ORGANIZATION_ENTITIES = [
  OrganizationEntity,
    OrganizationGroupEntity,
    WorkingScheduleEntryEntity,
    ContactPointEntity

]
