import { UniqueID } from "@domain/common/unique-id";
import { EmployeeName } from '@domain/employee/value-object/employee-name.vo';
import { EmployeeEmail } from '@domain/employee/value-object/employee-email.vo';
import { EmployeePhone } from '@domain/employee/value-object/employee-phone.vo';
import { EmployeePassword } from '@domain/employee/value-object/employee-password.vo';
import {CompanyId} from "@domain/company/company";
import {RoleId} from "@domain/policy/model/role";

export class EmployeeId extends UniqueID {}

export class Employee {
    private constructor(
      private readonly _id: EmployeeId,
      private readonly _companyId: CompanyId,
      private  _roleId: RoleId,
      private _name: EmployeeName,
      private _email: EmployeeEmail,
      private _phone: EmployeePhone,
      private _password: EmployeePassword,
      private _avatar: string | null,

      // private readonly _createdAt: Date = new Date(),
      // private _updatedAt: Date | null = null,
    ) {}

    static create(
        companyId: CompanyId,
        roleId: RoleId,
        name: EmployeeName,
        email: EmployeeEmail,
        phone: EmployeePhone,
        password: EmployeePassword,
        avatar: string | null = null
    ): Employee {
        return new Employee(
          new EmployeeId(),
            companyId,
            roleId,
            name,
            email,
            phone,
            password,
            avatar
        )
    }

    static fromPersistence(
        id: string,
        companyId: string,
        roleId: string,
        name: string,
        email: string,
        phone: string,
        password: string,
        avatar: string | null,
    ): Employee {
        return new Employee(
            new EmployeeId(id),
            new CompanyId(companyId),
            new RoleId(roleId),
            new EmployeeName(name),
            new EmployeeEmail(email),
            new EmployeePhone(phone),
            new EmployeePassword(password),
            avatar,
        )
    }

    set name(newName: EmployeeName) {
        this._name = newName;
    }

    set email(newEmail: EmployeeEmail) {
        this._email = newEmail;
    }

    set phone(newPhone: EmployeePhone) {
        this._phone = newPhone;
    }

    get password(): EmployeePassword {
        return this._password;
    }

    set password(newPassword: EmployeePassword) {
        this._password = newPassword;
    }

    set avatar(newAvatar: string | null) {
        this._avatar = newAvatar;
    }

    get id(): EmployeeId {
        return this._id;
    }

    get companyId() {
        return this._companyId;
    }

    get name() {
        return this._name;
    }

    get avatar(): string | null {
        return this._avatar;
    }

    get email() {
        return this._email;
    }

    get phone() {
        return this._phone;
    }
}
