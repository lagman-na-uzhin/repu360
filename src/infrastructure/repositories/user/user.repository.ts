import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/infrastructure/entities/user/user.entity';
import { Manager } from '@domain/manager/manager';
import {
  IPartnerUserRepository
} from "@domain/partner/repositories/partner-user-repository.interface";
import {ManagerPermission} from "@domain/manager/value-object/manager-permission";
import { IUserRepository } from '@domain/manager/repositories/manager-repository.interface';
import {PartnerUserRole, UserRoleId} from "@domain/partner/model/partner-user/partner-user-role";
import {UserPermissionEntity} from "@infrastructure/entities/user/access/user-permission.entity";
import {UserRoleEntity} from "@infrastructure/entities/user/access/user-role.entity";

@Injectable()
export class UserOrmRepository implements IPartnerUserRepository, IUserRepository {
  constructor(
    @InjectRepository(UserEntity) private readonly repo: Repository<UserEntity>,
    @InjectRepository(UserRoleEntity) private readonly roleRepo: Repository<UserRoleEntity>,
    @InjectRepository(UserPermissionEntity) private readonly permissionRepo: Repository<UserPermissionEntity>,
  ) {}

  async getByEmail(email: string): Promise<Manager | null> {
    const entity = await this.repo.findOne({ where: { email } })
    return entity ? this.toUserModel(entity) : null;
  }

  async getById(id: string): Promise<Manager | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.toUserModel(entity) : null;
  }

  async emailIsExist(email: string):  Promise<boolean> {
    return this.repo.existsBy({ email });
  }

  async phoneIsExist(phone: string):  Promise<boolean> {
    return this.repo.existsBy({ phone });
  }

  private toUserModel(entity: UserEntity): Manager {
    const permissions = entity.role.permissions.map(this.toUserPermissionModel)
    const role = this.toUserRoleModel(entity.role, permissions);

    return Manager.fromPersistence(
      entity.id,
      entity.partnerId,
      entity.email,
      entity.name,
      entity.phone,
      entity.password,
      role
    );
  }

  private toUserRoleModel(entity: UserRoleEntity, permissions: ManagerPermission[]) {
    return PartnerUserRole.fromPersistence(entity.id, entity.name, entity.type, permissions)
  }

  private toUserPermissionModel(entity: UserPermissionEntity) {
    return ManagerPermission.fromPersistence(entity.module);
  }
}
