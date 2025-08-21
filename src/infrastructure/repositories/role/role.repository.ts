import {IRoleRepository} from "@domain/policy/repositories/role-repository.interface";
import {Role, RoleId} from "@domain/policy/model/role";
import {EntityManager} from "typeorm";
import {UserRoleEntity} from "@infrastructure/entities/user/access/user-role.entity";
import {DEFAULT_PERMISSIONS_MODULE, DefaultPermissions} from "@domain/policy/model/default-permissions";
import {ControlPermissions} from "@domain/policy/model/control-permissions";
import {RoleType} from "@domain/policy/types/role-type.enum";
import {UserPermissionEntity} from "@infrastructure/entities/user/access/user-permission.entity";
import {InjectEntityManager} from "@nestjs/typeorm";
import {DefaultCompanyPermission} from "@domain/policy/model/default/default-company-permission.enum";
import {ManagerCompanyPermission} from "@domain/policy/model/control/manager-company.permission.enum";
import {ManagerOrganizationPermission} from "@domain/policy/model/control/manager-organization-permission.enum";
import {ManagerLeadPermission} from "@domain/policy/model/control/manager-lead-permission.enum";
import {DefaultReviewPermission} from "@domain/policy/model/default/default-review-permission.enum";
import {DefaultOrganizationPermission} from "@domain/policy/model/default/default-organization-permission.enum";
import {DefaultEmployeePermission} from "@domain/policy/model/default/default-employee-permission.enum";

const GLOBAL_ORGANIZATION_KEY = "*";

export class RoleOrmRepository implements IRoleRepository {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
    ) {}

    async save(role: Role): Promise<void> {
        console.log(this.fromDomain(role), "this.fromDomain(role entirt")
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

    private toPermissionsDomain(entity: UserRoleEntity): DefaultPermissions | ControlPermissions {
        // --- Employee Permissions ---
        const companiesPermissions = this.getPermissionsForModule<DefaultCompanyPermission>(entity.permissions, DEFAULT_PERMISSIONS_MODULE.COMPANIES);
        const employeesPermissions = this.getPermissionsForModule<DefaultEmployeePermission>(entity.permissions, DEFAULT_PERMISSIONS_MODULE.EMPLOYEE);
        const reviewsPermissionsMap = this.getPermissionsForOrganization<DefaultReviewPermission>(entity.permissions, DEFAULT_PERMISSIONS_MODULE.REVIEW);
        const organizationsPermissionsMap = this.getPermissionsForOrganization<DefaultOrganizationPermission>(entity.permissions, DEFAULT_PERMISSIONS_MODULE.ORGANIZATION);

        // --- Manager Permissions ---
        const controlOrganizationsPermissionsMap = this.getPermissionsForOrganization<ManagerOrganizationPermission>(entity.permissions, "MANAGER_ORGANIZATIONS");
        const controlLeadsPermissions = this.getPermissionsForModule<ManagerLeadPermission>(entity.permissions, "LEADS");
        const controlCompaniesPermissions = this.getPermissionsForModule<ManagerCompanyPermission>(entity.permissions, "MANAGER_COMPANIES");


        if (entity.type === RoleType.ADMIN || entity.type === RoleType.MANAGER) {
            return ControlPermissions.fromPersistence(
                controlCompaniesPermissions,
                controlOrganizationsPermissionsMap,
                controlLeadsPermissions,
            );
        } else {
            return DefaultPermissions.fromPersistence(
                companiesPermissions,
                employeesPermissions,
                reviewsPermissionsMap,
                organizationsPermissionsMap
            );
        }
    }

    private getPermissionsForOrganization<T extends string>(permissions: UserPermissionEntity[], module: string): Map<string, T[]> {
        const permissionsMap = new Map<string, T[]>();

        permissions.forEach(permissionEntity => {
            if (permissionEntity.module === module) {
                const orgKey = permissionEntity.organizationId || GLOBAL_ORGANIZATION_KEY;
                const currentPermissions = permissionsMap.get(orgKey) || [];

                currentPermissions.push(permissionEntity.permission as T);

                permissionsMap.set(orgKey, currentPermissions);
            }
        });

        return permissionsMap;
    }

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

        const userPermissions: UserPermissionEntity[] = [];

        if (role.isEmployee() || role.isOwner()) {
            const defaultPermissions = role.defaultPermissions as DefaultPermissions;

            defaultPermissions.companies.forEach(p => {
                const permissionEntity = new UserPermissionEntity();
                permissionEntity.id = crypto.randomUUID();
                permissionEntity.roleId = entity.id;
                permissionEntity.module = 'COMPANY';
                permissionEntity.permission = p;
                permissionEntity.organizationId = null;
                userPermissions.push(permissionEntity);
            });

            defaultPermissions.employees.forEach(p => {
                const permissionEntity = new UserPermissionEntity();
                permissionEntity.id = crypto.randomUUID();
                permissionEntity.roleId = entity.id;
                permissionEntity.module = 'EMPLOYEE';
                permissionEntity.permission = p;
                permissionEntity.organizationId = null;
                userPermissions.push(permissionEntity);
            });

            for (const [orgId, perms] of defaultPermissions.organizations.entries()) {
                perms.forEach(p => {
                    const permissionEntity = new UserPermissionEntity();
                    permissionEntity.id = crypto.randomUUID();
                    permissionEntity.roleId = entity.id;
                    permissionEntity.module = 'ORGANIZATION';
                    permissionEntity.permission = p;
                    permissionEntity.organizationId = orgId === GLOBAL_ORGANIZATION_KEY ? null : orgId;
                    userPermissions.push(permissionEntity);
                });
            }

            for (const [orgId, perms] of defaultPermissions.reviews.entries()) {
                perms.forEach(p => {
                    const permissionEntity = new UserPermissionEntity();
                    permissionEntity.id = crypto.randomUUID();
                    permissionEntity.roleId = entity.id;
                    permissionEntity.module = 'REVIEW';
                    permissionEntity.permission = p;
                    permissionEntity.organizationId = orgId === GLOBAL_ORGANIZATION_KEY ? null : orgId;
                    userPermissions.push(permissionEntity);
                });
            }
        }
        else if (role.isManager() || role.isAdmin()) {
            const controlPermissions = role.controlPermissions as ControlPermissions;

            controlPermissions.companies.forEach(p => {
                const permissionEntity = new UserPermissionEntity();
                permissionEntity.id = crypto.randomUUID();
                permissionEntity.roleId = entity.id;
                permissionEntity.module = 'COMPANIES';
                permissionEntity.permission = p;
                permissionEntity.organizationId = null;
                userPermissions.push(permissionEntity);
            });

            for (const [orgId, perms] of controlPermissions.organizations.entries()) {
                perms.forEach(p => {
                    const permissionEntity = new UserPermissionEntity();
                    permissionEntity.id = crypto.randomUUID();
                    permissionEntity.roleId = entity.id;
                    permissionEntity.module = 'ORGANIZATIONS';
                    permissionEntity.permission = p;
                    permissionEntity.organizationId = orgId === GLOBAL_ORGANIZATION_KEY ? GLOBAL_ORGANIZATION_KEY : orgId;
                    userPermissions.push(permissionEntity);
                });
            }

            controlPermissions.leads.forEach(p => {
                const permissionEntity = new UserPermissionEntity();
                permissionEntity.id = crypto.randomUUID();
                permissionEntity.roleId = entity.id;
                permissionEntity.module = 'LEADS';
                permissionEntity.permission = p;
                permissionEntity.organizationId = null;
                userPermissions.push(permissionEntity);
            });
        }

        entity.permissions = userPermissions;

        return entity;
    }
}
