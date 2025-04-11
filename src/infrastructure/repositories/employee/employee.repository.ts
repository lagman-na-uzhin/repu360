import { Injectable } from '@nestjs/common';
import {FindOneOptions, Repository} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/infrastructure/entities/user/user.entity';
import { Manager } from '@domain/manager/manager';
import {IEmployeeRepository} from "@domain/employee/repositories/employee-repository.interface";
import {ManagerPermission} from "@domain/manager/value-object/manager-permission";
import {UserPermissionEntity} from "@infrastructure/entities/user/access/user-permission.entity";
import {UserRoleEntity} from "@infrastructure/entities/user/access/user-role.entity";
import {EmployeeEmail} from "@domain/employee/value-object/employee-email.vo";
import {Employee, EmployeeId} from "@domain/employee/employee";
import {EmployeeRole} from "@domain/employee/model/employee-role";
import {EmployeeType} from "@domain/employee/value-object/employee-role/employee-type.vo";

@Injectable()
export class EmployeeOrmRepository implements IEmployeeRepository {
  constructor(
    @InjectRepository(UserEntity) private readonly repo: Repository<UserEntity>,
    @InjectRepository(UserRoleEntity) private readonly roleRepo: Repository<UserRoleEntity>,
    @InjectRepository(UserPermissionEntity) private readonly permissionRepo: Repository<UserPermissionEntity>,
  ) {}

  async getByEmail(email: EmployeeEmail): Promise<Employee | null> {
    const entity = await this.repo.findOne({where: { email: email.toString() }});
    return entity ? this.toUserModel(entity) : null;
  }

  async getById(id: EmployeeId): Promise<Employee | null> {
    const entity = await this.repo.findOne({where: { id: id.toString() }});
    return entity ? this.toUserModel(entity) : null;
  }

  async emailIsExist(email: string):  Promise<boolean> {
    return this.repo.existsBy({ email });
  }

  async phoneIsExist(phone: string):  Promise<boolean> {
    return this.repo.existsBy({ phone });
  }

  private toEmployeeModel(entity: UserEntity): Manager {
    const role = this.toEmployeeRoleModel(entity.role, permissions);

    return Employee .fromPersistence(
      entity.id,
      entity.partnerId,
      entity.email,
      entity.name,
      entity.phone,
      entity.password,
      role
    );
  }

  private toEmployeeRoleModel(entity: UserRoleEntity) {
    const permissions = [];
    return EmployeeRole.fromPersistence(entity.id, entity.name, new EmployeeType(entity.type), permissions)
  }

  private toUserPermissionModel(entity: UserPermissionEntity) {
    return ManagerPermission.fromPersistence(entity.module);
  }
}
