import { OrganizationOrmRepository } from 'src/infrastructure/repositories/organization/organization.repository';
import {CacheRepository} from "src/infrastructure/repositories/cache/cache.repository";
import { EmployeeOrmRepository } from '@infrastructure/repositories/employee/employee.repository';
import { CompanyOrmRepository } from '@infrastructure/repositories/company/company.repository';
import {PlacementOrmRepository} from "@infrastructure/repositories/placement/placement.repository";
import {ProfileOrmRepository} from "@infrastructure/repositories/profile/profile.repository";
import {ReviewOrmRepository} from "@infrastructure/repositories/review/review.repository";
import {RoleOrmRepository} from "@infrastructure/repositories/role/role.repository";
import {ManagerOrmRepository} from "@infrastructure/repositories/manager/manager.repository";
import {ProxyOrmRepository} from "@infrastructure/repositories/proxy/proxy.repository";
import {TwogisRepository} from "@infrastructure/integrations/twogis/twogis.repository";
import {ReplyTemplateOrmRepository} from "@infrastructure/repositories/auto-reply/reply-template.repository";
import {SubscriptionOrmRepository} from "@infrastructure/repositories/subscription/subscription.repository";
import {TariffOrmRepository} from "@infrastructure/repositories/subscription/tariff.repository";
import {LeadOrmRepository} from "@infrastructure/repositories/lead/lead.repository";

export const REPOSITORIES = [
  CacheRepository,
  CompanyOrmRepository,
  EmployeeOrmRepository,
  OrganizationOrmRepository,
  PlacementOrmRepository,
  ProfileOrmRepository,
  ReviewOrmRepository,
  RoleOrmRepository,
  ManagerOrmRepository,
  ProxyOrmRepository,
  TwogisRepository,
  ReplyTemplateOrmRepository,
  SubscriptionOrmRepository,
  TariffOrmRepository,
  LeadOrmRepository
]
