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
import {ControlPermissions} from "@domain/policy/model/control-permissions";
import {DefaultPermissions} from "@domain/policy/model/default-permissions";
import {RoleType} from "@domain/policy/types/role-type.enum";
import {ManagerOrganizationPermission} from "@domain/policy/model/control/manager-organization-permission.enum";
import {ManagerLeadPermission} from "@domain/policy/model/control/manager-lead-permission.enum";
import {ManagerCompanyPermission} from "@domain/policy/model/control/manager-company.permission.enum";
import {DefaultCompanyPermission} from "@domain/policy/model/default/default-company-permission.enum";
import {DefaultReviewPermission} from "@domain/policy/model/default/default-review-permission.enum";
import {DefaultOrganizationPermission} from "@domain/policy/model/default/default-organization-permission.enum";
import {DefaultEmployeePermission} from "@domain/policy/model/default/default-employee-permission.enum";

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
    let permissions: DefaultPermissions | ControlPermissions;

    if (persistence.role.type === RoleType.ADMIN || persistence.role.type === RoleType.MANAGER) {
      const managerData = persistence as ManagerAuthDataType;

      const managerCompanies = managerData.role.permissions.companies as ManagerCompanyPermission[];

      const managerOrganizationsMap = new Map<string, ManagerOrganizationPermission[]>();

      const managerLeads = managerData.role.permissions.leads as ManagerLeadPermission[];

      permissions = ControlPermissions.fromPersistence(
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

      const defaultCompanies = employeeData.role.permissions.companies as DefaultCompanyPermission[];
      const defaultEmployees = employeeData.role.permissions.employees as DefaultEmployeePermission[];

      const defaultReviewsMap = new Map<string, DefaultReviewPermission[]>();
      employeeData.role.permissions.reviews.forEach(item => {
        defaultReviewsMap.set(item.organizationId, item.permissions as DefaultReviewPermission[]);
      });

      const defaultOrganizationsMap = new Map<string, DefaultOrganizationPermission[]>();
      employeeData.role.permissions.organizations.forEach(item => {
        defaultOrganizationsMap.set(item.organizationId, item.permissions as DefaultOrganizationPermission[]);
      });

      permissions = DefaultPermissions.fromPersistence(
          defaultCompanies,
          defaultEmployees,
          defaultReviewsMap,
          defaultOrganizationsMap,
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
