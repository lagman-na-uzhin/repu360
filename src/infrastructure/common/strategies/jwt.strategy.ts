import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IJwtServicePayload } from '@application/interfaces/services/jwt/jwt-service.interface';
import { EnvConfigService } from '@infrastructure/config/env-config/env-config.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { CACHE_KEY } from '@application/interfaces/repositories/cache/cache-key.const';
import { FastifyRequest } from 'fastify';
import {EmployeeAuthDataType} from "@application/interfaces/repositories/cache/types/employee-auth-data.type";
import {Actor} from "@domain/policy/actor";
import {Role} from "@domain/policy/model/role";
import {ManagerAuthDataType} from "@application/interfaces/repositories/cache/types/manager-auth-data.type";
import {ManagerPermissions} from "@domain/policy/model/manager-permissions";
import {EmployeePermissions} from "@domain/policy/model/employee-permissions";
import {RoleType} from "@domain/policy/value-object/role/type.vo";
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
    console.log("validate")
    const { authId, ownerId } = payload;

    const redisClient = this.redisService.getOrThrow('default');

    const rawUserData = ownerId
        ? await redisClient.get(CACHE_KEY.COMMON.MULTIPLE_AUTH_TOKEN(ownerId, authId))
        : await redisClient.get(CACHE_KEY.COMMON.AUTH_TOKEN(authId));

    console.log(rawUserData, "rawUserData")
    if (!rawUserData) return false;
    console.log(this.getActor(rawUserData))
    return this.getActor(rawUserData);
  }

  private getActor(raw: string): Actor {
    const persistence: ManagerAuthDataType | EmployeeAuthDataType = JSON.parse(raw);
    let permissions: EmployeePermissions | ManagerPermissions;

    const roleType = new RoleType(persistence.role.type);

    if (roleType.equals(RoleType.type.ADMIN) || roleType.equals(RoleType.type.MANAGER)) {
      const managerData = persistence as ManagerAuthDataType;


      const managerCompanies = managerData.role.permissions.companies as ManagerCompanyPermission[];


      const managerOrganizationsMap = new Map<string, ManagerOrganizationPermission[]>();

      const managerLeads = managerData.role.permissions.leads as ManagerLeadPermission[];

      permissions = ManagerPermissions.fromPersistence(
          managerCompanies,        // 1st arg: companies (ManagerCompanyPermission[])
          managerOrganizationsMap, // 2nd arg: organizations (Map<string, ManagerOrganizationPermission[]>)
          managerLeads             // 3rd arg: leads (ManagerLeadPermission[])
      );

      const role = Role.fromPersistence(
          persistence.role.id,
          persistence.role.name,
          persistence.role.type,
          permissions
      );
      return Actor.fromPersistence(persistence.id, role);

    } else {
      const employeeData = persistence as EmployeeAuthDataType;

      const employeeCompanies = employeeData.role.permissions.companies as EmployeeCompanyPermission[];

      const employeeReviewsRecord: Record<string, EmployeeReviewPermission[]> = {};
      employeeData.role.permissions.reviews.forEach(item => {
        employeeReviewsRecord[item.organizationId] = item.permissions as EmployeeReviewPermission[];
      });
      const employeeReviewsMap = new Map(Object.entries(employeeReviewsRecord)); // Convert to Map

      const employeeOrganizationsRecord: Record<string, EmployeeOrganizationPermission[]> = {};
      employeeData.role.permissions.organizations.forEach(item => {
        employeeOrganizationsRecord[item.organizationId] = item.permissions as EmployeeOrganizationPermission[];
      });
      const employeeOrganizationsMap = new Map(Object.entries(employeeOrganizationsRecord)); // Convert to Map


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

      return Actor.fromPersistence(persistence.id, role);
    }
  }
}
