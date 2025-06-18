import {IRoleRepository} from "@domain/policy/repositories/role-repository.interface";
import {Role, RoleId} from "@domain/policy/model/role";
import {EntityManager} from "typeorm";
import {UserRoleEntity} from "@infrastructure/entities/user/access/user-role.entity";
import {EmployeePermissions} from "@domain/policy/model/employee-permissions";
import {ManagerPermissions} from "@domain/policy/model/manager-permissions";
import {RoleType} from "@domain/policy/value-object/role/type.vo";
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
        return Promise.resolve(undefined); // Implementation needs to be added here
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
        const roleType = new RoleType(entity.type);

        // --- Employee Permissions ---
        const employeeCompaniesPermissions = this.getPermissionsForModule<EmployeeCompanyPermission>(entity.permissions, "COMPANIES");
        // FIX: Specify the exact enum type for reviews and organizations when calling the generic method
        const employeeReviewsPermissionsMap = this.getPermissionsForOrganization<EmployeeReviewPermission>(entity.permissions, "REVIEWS");
        const employeeOrganizationsPermissionsMap = this.getPermissionsForOrganization<EmployeeOrganizationPermission>(entity.permissions, "ORGANIZATIONS");

        // --- Manager Permissions ---
        // FIX: Specify the exact enum type for organizations and leads when calling the generic method
        const managerOrganizationsPermissionsMap = this.getPermissionsForOrganization<ManagerOrganizationPermission>(entity.permissions, "MANAGER_ORGANIZATIONS");
        // FIX: getPermissionsForModule is for simple arrays, so this is correct if leads is a simple array in ManagerPermissions
        // If ManagerPermissions.fromPersistence expects a Map for leads, then getPermissionsForOrganization should be used here too.
        // Based on the last accepted signature: leads is a simple array (ManagerLeadPermission[]).
        const managerLeadsPermissions = this.getPermissionsForModule<ManagerLeadPermission>(entity.permissions, "LEADS");
        const managerCompaniesPermissions = this.getPermissionsForModule<ManagerCompanyPermission>(entity.permissions, "MANAGER_COMPANIES");


        if (roleType.equals(RoleType.type.ADMIN) || roleType.equals(RoleType.type.MANAGER)) { // Using RoleType.Admin and RoleType.Manager as properties
            // Assuming ManagerPermissions.fromPersistence expects:
            // (companies: ManagerCompanyPermission[], organizations: Map<string, ManagerOrganizationPermission[]>, leads: ManagerLeadPermission[])
            return ManagerPermissions.fromPersistence(
                managerCompaniesPermissions,
                managerOrganizationsPermissionsMap, // Now Map<string, ManagerOrganizationPermission[]>
                managerLeadsPermissions,           // Now ManagerLeadPermission[] (simple array from getPermissionsForModule)
            );
        } else {
            // Assuming EmployeePermissions.fromPersistence expects:
            // (companies: EmployeeCompanyPermission[], reviews: Map<string, EmployeeReviewPermission[]>, organizations: Map<string, EmployeeOrganizationPermission[]>)
            return EmployeePermissions.fromPersistence(
                employeeCompaniesPermissions,
                employeeReviewsPermissionsMap,     // Now Map<string, EmployeeReviewPermission[]>
                employeeOrganizationsPermissionsMap // Now Map<string, EmployeeOrganizationPermission[]>
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

                // Get current array or create new one, ensuring type T[]
                const currentPermissions = permissionsMap.get(orgKey) || [];

                // Push the permission (asserting type T)
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
            // Only include permissions that match the module and are not tied to a specific organization
            if (permissionEntity.module === module && !permissionEntity.organizationId) {
                result.push(permissionEntity.permission as T);
            }
        });
        return result;
    }
}
