import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { IEmployeeRepository } from "@domain/employee/repositories/employee-repository.interface";
import {EmployeeEmail} from "@domain/employee/value-object/employee-email.vo";
import {Employee, EmployeeId} from "@domain/employee/employee";
import {UserEntity} from "@infrastructure/entities/user/user.entity";
import {EmployeePhone} from "@domain/employee/value-object/employee-phone.vo";
import {InjectEntityManager} from "@nestjs/typeorm";
import {CompanyId} from "@domain/company/company";
import {RoleId} from "@domain/policy/model/role";
import {IManagerRepository} from "@domain/manager/repositories/manager-repository.interface";
import {Manager, ManagerId} from "@domain/manager/manager";
import {ManagerEmail} from "@domain/manager/value-object/manager-email.vo";
import {BaseRepository} from "@infrastructure/repositories/base-repository";
import {CompanyEntity} from "@infrastructure/entities/company/company.entity";

@Injectable()
export class ManagerOrmRepository implements IManagerRepository {
  constructor(
      @InjectEntityManager() private readonly manager: EntityManager,
      private readonly base: BaseRepository<CompanyEntity>
  ) {}

  async getByEmail(email: ManagerEmail): Promise<Manager | null> {
    const entity = await this.manager.getRepository(UserEntity).findOne({
      where: { email: email.toString() },
    });
    console.log(entity, 'entty')
    return entity ? this.toDomain(entity) : null;
  }

  async getById(id: ManagerId): Promise<Manager | null> {
    const entity = await this.manager.findOne(UserEntity, {
      where: { id: id.toString() },
    });
    return entity ? this.toDomain(entity) : null;
  }


  private toDomain(entity: UserEntity): Manager {
    return Manager.fromPersistence(entity.id, entity.email, entity.name, entity.phone, entity.password, entity.roleId);
  }

  private fromDomain(manager: Manager): UserEntity {
    // TODO: реализовать маппинг из Employee в UserEntity
    throw new Error("Not implemented");
  }
}
