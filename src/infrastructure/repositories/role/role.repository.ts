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

export class RoleOrmRepository implements IRoleRepository {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
    ) {}

    async save(role: Role): Promise<void> {
        return Promise.resolve(undefined);
    }

    async getById(id: RoleId): Promise<Role | null> {
        const entity = await this.manager.getRepository(UserRoleEntity).findOne( {
            where: {
                id: id.toString()
            }
        })
        return entity ? this.toDomain(entity) : null;
    }

    private toDomain(entity: UserRoleEntity) {
        const permissions = this.toPermissionsDomain(entity);
        return Role.fromPersistence(
            entity.id,
            entity.name,
            entity.type,
            permissions
        )
    }

    private toPermissionsDomain(entity: UserRoleEntity): EmployeePermissions | ManagerPermissions {
        const roleType = new RoleType(entity.type);

        const companiesPermissions = this.getPermissionsForModule(entity.permissions, "COMPANIES");

        const reviewsPermissionsMap = this.getPermissionsForOrganization(entity.permissions, "REVIEWS");

        const organizationsPermissionsMap = this.getPermissionsForOrganization(entity.permissions, "ORGANIZATIONS");

        const leadsPermissions = this.getPermissionsForModule(entity.permissions, "LEADS");


        if (roleType.equals(RoleType.type.ADMIN) || roleType.equals(RoleType.type.MANAGER)) {
            return ManagerPermissions.fromPersistence(companiesPermissions, leadsPermissions);
        } else {
            return EmployeePermissions.fromPersistence(companiesPermissions, reviewsPermissionsMap, organizationsPermissionsMap);
        }
    }



    private getPermissionsForModule(permissions: UserPermissionEntity[], module: string): Set<string> {
        const permissionsSet = new Set<string>();
        permissions.forEach(permission => {
            if (permission.module === module) {
                permissionsSet.add(permission.permission);
            }
        });
        return permissionsSet;
    }

    private getPermissionsForOrganization(permissions: UserPermissionEntity[], module: string): Map<OrganizationId, Set<string>> {
        const permissionsMap = new Map<OrganizationId, Set<string>>();

        permissions.forEach(permission => {
            if (permission.module === module && permission.organizationId) {
                const organizationId = new OrganizationId(permission.organizationId);
                if (!permissionsMap.has(organizationId)) {
                    permissionsMap.set(organizationId, new Set<string>());
                }
                permissionsMap.get(organizationId)!.add(permission.permission);
            }
        });

        return permissionsMap;
    }


}
