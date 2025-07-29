import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { IEmployeeRepository } from "@domain/employee/repositories/employee-repository.interface";
import {EmployeeEmail} from "@domain/employee/value-object/employee-email.vo";
import {Employee, EmployeeId} from "@domain/employee/employee";
import {UserEntity} from "@infrastructure/entities/user/user.entity";
import {EmployeePhone} from "@domain/employee/value-object/employee-phone.vo";
import {InjectEntityManager} from "@nestjs/typeorm";
import {GetEmployeeListParams} from "@domain/employee/repositories/params/get-employee-list.params";
import {PaginatedResult} from "@application/interfaces/query-services/common/paginated-result.interface";
import {BaseRepository} from "@infrastructure/repositories/base-repository";
import {CompanyId} from "@domain/company/company";

@Injectable()
export class EmployeeOrmRepository extends BaseRepository<UserEntity> implements IEmployeeRepository {
  constructor(
      @InjectEntityManager() private readonly manager: EntityManager,
  ) {
    super();}

  async getByEmail(email: EmployeeEmail): Promise<Employee | null> {
    const entity = await this.manager.getRepository(UserEntity).findOne({
      where: { email: email.toString() },
    });
    console.log(entity, 'entty')
    return entity ? this.toDomain(entity) : null;
  }

  async getById(id: EmployeeId): Promise<Employee | null> {
    const entity = await this.manager.findOne(UserEntity, {
      where: { id: id.toString() },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async emailIsExist(email: EmployeeEmail): Promise<boolean> {
    const count = await this.manager.count(UserEntity, {
      where: { email: email.toString() },
    });
    return count > 0;
  }

  async phoneIsExist(phone: EmployeePhone): Promise<boolean> {
    const count = await this.manager.count(UserEntity, {
      where: { phone: phone.toString() },
    });
    return count > 0;
  }

  async save(employee: Employee): Promise<void> {
    await this.manager.getRepository(UserEntity).save(this.fromDomain(employee));
  }

  private toDomain(entity: UserEntity): Employee {
    return Employee.fromPersistence(
        entity.id,
        entity.companyId!,
        entity.roleId,
        entity.name,
        entity.email,
        entity.phone,
        entity.password,
        entity.avatar
    )
  }

  private fromDomain(employee: Employee): UserEntity {
    const entity = new UserEntity();

    entity.id = employee.id.toString();
    entity.name = employee.name.toString();
    entity.email = employee.email.toString();
    entity.phone = employee.phone.toString();
    entity.password = employee.password.toString();
    entity.avatar = employee.avatar
    entity.companyId = employee.companyId.toString();
    entity.roleId = employee.roleId.toString();

    return entity;
  }


  private createQb() {
    return this.manager
        .getRepository(UserEntity)
        .createQueryBuilder('employee')
  }
}
