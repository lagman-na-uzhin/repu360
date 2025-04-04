import { OrganizationOrmRepository } from 'src/infrastructure/repositories/organization/organization.repository';
import {CacheRepository} from "src/infrastructure/repositories/cache/cache.repository";
import { UserOrmRepository } from '@infrastructure/repositories/user/user.repository';
import { PartnerOrmRepository } from '@infrastructure/repositories/partner/partner.repository';

export const REPOSITORIES = [
  OrganizationOrmRepository,
  CacheRepository,
  UserOrmRepository,
  PartnerOrmRepository
]
