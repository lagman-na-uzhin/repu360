import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IJwtServicePayload } from '@application/interfaces/services/jwt/jwt-service.interface';
import { EnvConfigService } from '@infrastructure/config/env-config/env-config.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { CACHE_KEY } from '@application/interfaces/services/cache/cache-key.const';
import { FastifyRequest } from 'fastify';
import {EmployeeAuthDataType} from "@application/interfaces/services/cache/types/employee-auth-data.type";
import {Actor} from "@domain/policy/actor";
import {Role} from "@domain/policy/model/role";
import {ManagerAuthDataType} from "@application/interfaces/services/cache/types/manager-auth-data.type";
import {ManagerPermissions} from "@domain/policy/model/manager-permissions";
import {EmployeePermissions} from "@domain/policy/model/employee-permissions";
import {RoleType} from "@domain/policy/types/role-type.enum";
import {ManagerOrganizationPermission} from "@domain/policy/model/manager/manager-organization-permission.enum";
import {ManagerLeadPermission} from "@domain/policy/model/manager/manager-lead-permission.enum";
import {ManagerCompanyPermission} from "@domain/policy/model/manager/manager-company.permission.enum";
import {EmployeeCompanyPermission} from "@domain/policy/model/employee/employee-company-permission.enum";
import {EmployeeReviewPermission} from "@domain/policy/model/employee/employee-review-permission.enum";
import {EmployeeOrganizationPermission} from "@domain/policy/model/employee/employee-organization-permission.enum";

const GLOBAL_ORGANIZATION_KEY = "*"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
      private readonly envConfigService: EnvConfigService,
      private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: FastifyRequest) => {
          return request.cookies?.Authentication ?? null;
        },
      ]),
      secretOrKey: envConfigService.getJwtSecret(),
    } as any);

  }

  async validate(payload: IJwtServicePayload) {
    const { authId, ownerId } = payload;

    const redisClient = this.redisService.getOrThrow('default');

    const rawUserData = ownerId
        ? await redisClient.get(CACHE_KEY.COMMON.MULTIPLE_AUTH_TOKEN(ownerId, authId))
        : await redisClient.get(CACHE_KEY.COMMON.AUTH_TOKEN(authId));

    if (!rawUserData) return false;
    return this.getActor(rawUserData);
  }

  private getActor(raw: string): Actor {
    const persistence: ManagerAuthDataType | EmployeeAuthDataType = JSON.parse(raw);
    let permissions: EmployeePermissions | ManagerPermissions;

    if (persistence.role.type === RoleType.ADMIN || persistence.role.type === RoleType.MANAGER) {
      const managerData = persistence as ManagerAuthDataType;

      const managerCompanies = managerData.role.permissions.companies as ManagerCompanyPermission[];

      const managerOrganizationsMap = new Map<string, ManagerOrganizationPermission[]>();

      const managerLeads = managerData.role.permissions.leads as ManagerLeadPermission[];

      permissions = ManagerPermissions.fromPersistence(
          managerCompanies,
          managerOrganizationsMap,
          managerLeads
      );

      const role = Role.fromPersistence(
          persistence.role.id,
          persistence.role.name,
          persistence.role.type,
          permissions
      );
      return Actor.fromPersistence(persistence.id, null, role);

    } else {
      const employeeData = persistence as EmployeeAuthDataType;

      const employeeCompanies = employeeData.role.permissions.companies as EmployeeCompanyPermission[];

      const employeeReviewsMap = new Map<string, EmployeeReviewPermission[]>();
      employeeData.role.permissions.reviews.forEach(item => {
        employeeReviewsMap.set(item.organizationId, item.permissions as EmployeeReviewPermission[]);
      });

      const employeeOrganizationsMap = new Map<string, EmployeeOrganizationPermission[]>();
      employeeData.role.permissions.organizations.forEach(item => {
        employeeOrganizationsMap.set(item.organizationId, item.permissions as EmployeeOrganizationPermission[]);
      });

      permissions = EmployeePermissions.fromPersistence(
          employeeCompanies,
          employeeReviewsMap,
          employeeOrganizationsMap,
      );

      const role = Role.fromPersistence(
          persistence.role.id,
          persistence.role.name,
          persistence.role.type,
          permissions
      );

      return Actor.fromPersistence(employeeData.id, employeeData.companyId, role);
    }
  }
}
