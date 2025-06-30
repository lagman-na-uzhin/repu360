import { UniqueID } from '@domain/common/unique-id';
import { ManagerEmail } from '@domain/manager/value-object/manager-email.vo';
import { ManagerName } from '@domain/manager/value-object/manager-name.vo';
import { ManagerPhone } from '@domain/manager/value-object/manager-phone.vo';
import { ManagerPassword } from '@domain/manager/value-object/manager-password.vo';
import {Lead} from "@domain/lead/lead";
import {RoleId} from "@domain/policy/model/role";

export class ManagerId extends UniqueID {}

export class Manager {
    private constructor(
      private readonly _id: ManagerId,
      private _email: ManagerEmail,
      private _name: ManagerName,
      private _phone: ManagerPhone,
      private _password: ManagerPassword,
      private _roleId: RoleId,

      private readonly _createdAt: Date = new Date(),
      private _updatedAt: Date | null = null,
      private _deletedAt: Date | null = null
    ) {}

    static create(
      email: string,
      name: string,
      phone: string,
      password: string,
      roleId: RoleId,

    ): Manager {
        return new Manager(
          new ManagerId(),
          new ManagerEmail(email),
          new ManagerName(name),
          new ManagerPhone(phone),
          new ManagerPassword(password),
            roleId,
        );
    }

    static fromPersistence(
      id: string,
      email: string,
      name: string,
      phone: string,
      password: string,
      roleId: string,
    ): Manager {
        return new Manager(
            new ManagerId(id),
            new ManagerEmail(email),
            new ManagerName(name),
            new ManagerPhone(phone),
            new ManagerPassword(password),
            new RoleId(roleId),
        );
    }

    toPlaintObject() {
        return {
            id: this._id.toString(),
            email: this._email.toString(),
            name: this._name.toString(),
            phone: this._phone.toString(),
            password: this._password.toString(),
            roleId: this._roleId.toString()
        }
    }

    get id(): ManagerId {
        return this._id;
    }

    get email(): ManagerEmail {
        return this._email;
    }

    set email(email: string) {
        this._email = new ManagerEmail(email);
    }

    get name(): ManagerName {
        return this._name;
    }

    set name(name: string) {
        this._name = new ManagerName(name);
    }

    get phone(): ManagerPhone {
        return this._phone;
    }

    set phone(phone: string) {
        this._phone = new ManagerPhone(phone);
    }

    get password(): ManagerPassword {
        return this._password;
    }

    set password(password: string) {
        this._password = new ManagerPassword(password);
    }

    get roleId(): RoleId {
        return this._roleId;
    }

}
