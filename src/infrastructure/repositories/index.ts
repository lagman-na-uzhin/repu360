import { OrganizationOrmRepository } from 'src/infrastructure/repositories/organization/organization.repository';
import {CacheRepository} from "src/infrastructure/repositories/cache/cache.repository";
import { UserOrmRepository } from '@infrastructure/repositories/employee/employee.repository';
import { PartnerOrmRepository } from '@infrastructure/repositories/company/company.repository';

export const REPOSITORIES = [
  OrganizationOrmRepository,
  CacheRepository,
  UserOrmRepository,
  PartnerOrmRepository
]
