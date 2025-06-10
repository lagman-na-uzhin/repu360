import { UserEntity } from '@infrastructure/entities/user/user.entity';
import {UserRoleEntity} from "@infrastructure/entities/user/access/user-role.entity";
import {UserPermissionEntity} from "@infrastructure/entities/user/access/user-permission.entity";

export const USER_ENTITIES = [UserEntity, UserRoleEntity, UserPermissionEntity]
