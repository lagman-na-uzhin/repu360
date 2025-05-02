import { OrganizationOrmRepository } from 'src/infrastructure/repositories/organization/organization.repository';
import {CacheRepository} from "src/infrastructure/repositories/cache/cache.repository";
import { EmployeeOrmRepository } from '@infrastructure/repositories/employee/employee.repository';
import { CompanyOrmRepository } from '@infrastructure/repositories/company/company.repository';
import {PlacementOrmRepository} from "@infrastructure/repositories/placement/placement.repository";
import {ProfileOrmRepository} from "@infrastructure/repositories/profile/profile.repository";
import {ReviewOrmRepository} from "@infrastructure/repositories/review/review.repository";
import {RoleOrmRepository} from "@infrastructure/repositories/role/role.repository";
import {ManagerOrmRepository} from "@infrastructure/repositories/manager/manager.repository";

export const REPOSITORIES = [
  CacheRepository,
  CompanyOrmRepository,
  EmployeeOrmRepository,
  OrganizationOrmRepository,
  PlacementOrmRepository,
  ProfileOrmRepository,
  ReviewOrmRepository,
  RoleOrmRepository,
    ManagerOrmRepository
]
