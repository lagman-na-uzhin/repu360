import { Injectable } from '@nestjs/common';
import { Repository} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/infrastructure/entities/user/user.entity';
import {IEmployeeRepository} from "@domain/employee/repositories/employee-repository.interface";
import {UserPermissionEntity} from "@infrastructure/entities/user/access/user-permission.entity";
import {UserRoleEntity} from "@infrastructure/entities/user/access/user-role.entity";
import {EmployeeEmail} from "@domain/employee/value-object/employee-email.vo";
import {Employee, EmployeeId} from "@domain/employee/employee";
import {EmployeePhone} from "@domain/employee/value-object/employee-phone.vo";
import {EmployeeRole} from "@domain/employee/model/employee-role";
import {ALL_ORGANIZATIONS, AllOrganizations, EmployeePermissions} from "@domain/employee/model/employee-permissions";
import {
  COMPANY_PERMISSIONS,
  CompanyPermission
} from "@domain/employee/value-object/employee-permissions/company-permissions.vo";
import {OrganizationId} from "@domain/organization/organization";
import {
  REVIEW_PERMISSIONS,
  ReviewPermission
} from "@domain/employee/value-object/employee-permissions/review-permissions.vo";

@Injectable()
export class EmployeeOrmRepository implements IEmployeeRepository {
  constructor(
    @InjectRepository(UserEntity) private readonly repo: Repository<UserEntity>,
    @InjectRepository(UserRoleEntity) private readonly roleRepo: Repository<UserRoleEntity>,
    @InjectRepository(UserPermissionEntity) private readonly permissionRepo: Repository<UserPermissionEntity>,
  ) {}

  async getByEmail(email: EmployeeEmail): Promise<Employee | null> {
    const entity = await this.repo.findOne({where: { email: email.toString() }});
    return entity ? this.toDomain(entity) : null;
  }

  async getById(id: EmployeeId): Promise<Employee | null> {
    const entity = await this.repo.findOne({where: { id: id.toString() }});
    return entity ? this.toDomain(entity) : null;
  }

  async emailIsExist(email: EmployeeEmail):  Promise<boolean> {
    return this.repo.existsBy({ email: email.toString() });
  }

  async phoneIsExist(phone: EmployeePhone):  Promise<boolean> {
    return this.repo.existsBy({ phone: phone.toString() });
  }

  async save(employee: Employee): Promise<void> {
    return Promise.resolve(undefined);
  }

  private toDomain(entity: UserEntity): Employee {
    const role = this.toDomainRole(entity.role);
    return Employee.fromPersistence(
        entity.id,
        entity.companyId,
        role,
        entity.name,
        entity.email,
        entity.phone,
        entity.password,
        entity.avatar,
    )
  }

  private toDomainRole(entity: UserRoleEntity): EmployeeRole {
    const permissions = this.toDomainPermissions(entity.permissions)
    return EmployeeRole.fromPersistence(
        entity.id,
        entity.name,
        entity.type,
        permissions
    )
  }

  private toDomainPermissions(entities: UserPermissionEntity[]): EmployeePermissions {
      const companyPermissions = new Set<CompanyPermission>();
      const reviewPermissions = new Map<OrganizationId | AllOrganizations, Set<ReviewPermission>>();

      for (const { organizationId, module, permission  } of entities) {
        if (module === "COMPANY" && COMPANY_PERMISSIONS.includes(permission as CompanyPermission)) {
          companyPermissions.add(permission as CompanyPermission);
        }

        if (module === "REVIEWS" && REVIEW_PERMISSIONS.includes(permission as ReviewPermission)) {
          if (!organizationId) continue;

          const orgKey: OrganizationId = new OrganizationId(organizationId);

          if (!reviewPermissions.has(orgKey)) {
            reviewPermissions.set(orgKey, new Set<ReviewPermission>());
          }

          reviewPermissions.get(orgKey)!.add(permission as ReviewPermission);
        }
      }

      return new EmployeePermissions(companyPermissions, reviewPermissions);
    }
}
