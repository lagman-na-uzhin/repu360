import {IRoleRepository} from "@domain/policy/repositories/role-repository.interface";
import {Role, RoleId} from "@domain/policy/model/role";
import {EntityManager} from "typeorm";
import {UserRoleEntity} from "@infrastructure/entities/user/access/user-role.entity";
import {EMPLOYEE_PERMISSIONS_MODULE, EmployeePermissions} from "@domain/policy/model/employee-permissions";
import {ManagerPermissions} from "@domain/policy/model/manager-permissions";
import {RoleType} from "@domain/policy/types/role-type.enum";
import {OrganizationId} from "@domain/organization/organization";
import {UserPermissionEntity} from "@infrastructure/entities/user/access/user-permission.entity";
import {InjectEntityManager} from "@nestjs/typeorm";
import {EmployeeCompanyPermission} from "@domain/policy/model/employee/employee-company-permission.enum";
import {ManagerCompanyPermission} from "@domain/policy/model/manager/manager-company.permission.enum";
import {ManagerOrganizationPermission} from "@domain/policy/model/manager/manager-organization-permission.enum";
import {ManagerLeadPermission} from "@domain/policy/model/manager/manager-lead-permission.enum";
import {EmployeeReviewPermission} from "@domain/policy/model/employee/employee-review-permission.enum";
import {EmployeeOrganizationPermission} from "@domain/policy/model/employee/employee-organization-permission.enum";

const GLOBAL_ORGANIZATION_KEY = "*";

export class RoleOrmRepository implements IRoleRepository {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
    ) {}

    async save(role: Role): Promise<void> {
        await this.manager.getRepository(UserRoleEntity).save(this.fromDomain(role));
    }

    async getById(id: RoleId): Promise<Role | null> {
        const entity = await this.manager.getRepository(UserRoleEntity).findOne({
            where: {
                id: id.toString()
            }
        });
        return entity ? this.toDomain(entity) : null;
    }

    private toDomain(entity: UserRoleEntity) {
        const permissions = this.toPermissionsDomain(entity);
        return Role.fromPersistence(
            entity.id,
            entity.name,
            entity.type,
            permissions
        );
    }

    private toPermissionsDomain(entity: UserRoleEntity): EmployeePermissions | ManagerPermissions {
        // --- Employee Permissions ---
        const employeeCompaniesPermissions = this.getPermissionsForModule<EmployeeCompanyPermission>(entity.permissions, EMPLOYEE_PERMISSIONS_MODULE.EMPLOYEE);
        const employeeReviewsPermissionsMap = this.getPermissionsForOrganization<EmployeeReviewPermission>(entity.permissions, EMPLOYEE_PERMISSIONS_MODULE.REVIEW);
        const employeeOrganizationsPermissionsMap = this.getPermissionsForOrganization<EmployeeOrganizationPermission>(entity.permissions, EMPLOYEE_PERMISSIONS_MODULE.ORGANIZATION);

        // --- Manager Permissions ---
        const managerOrganizationsPermissionsMap = this.getPermissionsForOrganization<ManagerOrganizationPermission>(entity.permissions, "MANAGER_ORGANIZATIONS");
        const managerLeadsPermissions = this.getPermissionsForModule<ManagerLeadPermission>(entity.permissions, "LEADS");
        const managerCompaniesPermissions = this.getPermissionsForModule<ManagerCompanyPermission>(entity.permissions, "MANAGER_COMPANIES");


        if (entity.type === RoleType.ADMIN || entity.type === RoleType.MANAGER) {
            return ManagerPermissions.fromPersistence(
                managerCompaniesPermissions,
                managerOrganizationsPermissionsMap,
                managerLeadsPermissions,
            );
        } else {
            return EmployeePermissions.fromPersistence(
                employeeCompaniesPermissions,
                employeeReviewsPermissionsMap,
                employeeOrganizationsPermissionsMap
            );
        }
    }

    /**
     * Generic method to get permissions grouped by organization ID (or global key).
     * @param permissions All UserPermissionEntity records.
     * @param module The specific module to filter by (e.g., "REVIEWS", "ORGANIZATIONS").
     * @returns A Map where keys are organization IDs (or "*") and values are arrays of specific enum permissions.
     */
    private getPermissionsForOrganization<T extends string>(permissions: UserPermissionEntity[], module: string): Map<string, T[]> {
        const permissionsMap = new Map<string, T[]>();

        permissions.forEach(permissionEntity => {
            if (permissionEntity.module === module) {
                const orgKey = permissionEntity.organizationId || GLOBAL_ORGANIZATION_KEY;
                const currentPermissions = permissionsMap.get(orgKey) || [];

                currentPermissions.push(permissionEntity.permission as T);

                // Set the updated array back into the Map
                permissionsMap.set(orgKey, currentPermissions);
            }
        });

        return permissionsMap;
    }

    /**
     * Generic method to get permissions for a specific module that are NOT tied to an organization.
     * @param permissions All UserPermissionEntity records.
     * @param module The specific module to filter by.
     * @returns An array of specific enum permissions.
     */
    private getPermissionsForModule<T extends string>(permissions: UserPermissionEntity[], module: string): T[] {
        const result: T[] = [];
        permissions.forEach(permissionEntity => {
            if (permissionEntity.module === module && !permissionEntity.organizationId) {
                result.push(permissionEntity.permission as T);
            }
        });
        return result;
    }

    private fromDomain(role: Role): UserRoleEntity {
        const entity = new UserRoleEntity();

        entity.id = role.id.toString();
        entity.name = role.name;
        entity.type = role.type.toString();

        return entity;
    }
}
