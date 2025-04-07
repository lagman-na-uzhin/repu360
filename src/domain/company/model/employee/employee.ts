import { UniqueEntityID } from "@domain/common/unique-id";
import { EmployeeName } from '@domain/company/value-object/employee-user-name.vo';
import { EmployeeEmail } from '@domain/company/value-object/employee-email.vo';
import { EmployeePhone } from '@domain/company/value-object/employee-user-phone.vo';
import { EmployeePassword } from '@domain/company/value-object/employee-user-password.vo';
import { EmployeeRole } from "@domain/company/model/employee/employee-role";

export class EmployeeId extends UniqueEntityID {}

export class Employee {
    private constructor(
      private readonly _id: EmployeeId,
      private readonly _role: EmployeeRole,
      private _name: EmployeeName,
      private _email: EmployeeEmail,
      private _phone: EmployeePhone,
      private _password: EmployeePassword,
      private _avatar: string | null
    ) {}

    static create(
      role: EmployeeRole,
      name: EmployeeName,
      email: EmployeeEmail,
      phone: EmployeePhone,
      password: EmployeePassword,
      avatar: string | null
    ): Employee {
        return new Employee(
          new EmployeeId(),
          role,
          name,
          email,
          phone,
          password,
          avatar
        )
    }

    static fromPersistence(id: string, role: EmployeeRole, name: string, email: string,  phone: string,password: string, avatar: string | null): Employee {
        return new Employee(
          new EmployeeId(id),
          role,
          new EmployeeName(name),
          new EmployeeEmail(email),
          new EmployeePhone(phone),
          new EmployeePassword(password),
          avatar
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

    get role(): EmployeeRole {
        return this.role;
    }
}
