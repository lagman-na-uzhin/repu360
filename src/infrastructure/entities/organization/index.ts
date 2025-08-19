import { OrganizationEntity } from '@infrastructure/entities/organization/organization.entity';
import {OrganizationGroupEntity} from "@infrastructure/entities/organization/group.entity";
import {ContactPointEntity} from "@infrastructure/entities/organization/contact-point.entity";
import {WorkingScheduleEntryEntity} from "@infrastructure/entities/organization/working-schedule-entries.entity";
import {WorkingScheduleEntity} from "@infrastructure/entities/organization/working-schedule.entity";
export const ORGANIZATION_ENTITIES = [
  OrganizationEntity,
    OrganizationGroupEntity,
    WorkingScheduleEntity,
    WorkingScheduleEntryEntity,
    ContactPointEntity

]
