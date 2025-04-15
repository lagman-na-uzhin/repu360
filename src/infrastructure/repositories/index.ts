import { OrganizationOrmRepository } from 'src/infrastructure/repositories/organization/organization.repository';
import {CacheRepository} from "src/infrastructure/repositories/cache/cache.repository";
import { EmployeeOrmRepository } from '@infrastructure/repositories/employee/employee.repository';
import { CompanyOrmRepository } from '@infrastructure/repositories/company/company.repository';

export const REPOSITORIES = [
  OrganizationOrmRepository,
  CacheRepository,
  EmployeeOrmRepository,
  CompanyOrmRepository
]
