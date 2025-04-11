import { UniqueID } from '@domain/common/unique-id';
import { ManagerEmail } from '@domain/manager/value-object/manager-email.vo';
import { ManagerName } from '@domain/manager/value-object/manager-name.vo';
import { ManagerPhone } from '@domain/manager/value-object/manager-phone.vo';
import { ManagerPassword } from '@domain/manager/value-object/manager-password.vo';
import { ManagerRole } from "@domain/manager/model/manager-role";
import {Lead} from "@domain/manager/model/lead/lead";

export class ManagerId extends UniqueID {}

export class Manager {
    private constructor(
      private readonly _id: ManagerId,
      private _email: ManagerEmail,
      private _name: ManagerName,
      private _phone: ManagerPhone,
      private _password: ManagerPassword,
      private _role: ManagerRole,
      private _leads: Lead[],

      private readonly _createdAt: Date = new Date(),
      private _updatedAt: Date | null = null,
      private _deletedAt: Date | null = null
    ) {}

    static create(
      email: string,
      name: string,
      phone: string,
      password: string,
      role: ManagerRole,
    ): Manager {
        return new Manager(
          new ManagerId(),
          new ManagerEmail(email),
          new ManagerName(name),
          new ManagerPhone(phone),
          new ManagerPhone(password),
          role,
        );
    }

    static fromPersistence(
      id: string,
      email: string,
      name: string,
      phone: string,
      password: string,
      role: ManagerRole,
    ): Manager {
        return new Manager(
            new ManagerId(id),
            new ManagerEmail(email),
            new ManagerName(name),
            new ManagerPhone(phone),
            new ManagerPassword(password),
          role,
        );
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

    get role(): ManagerRole {
        return this._role;
    }

    set role(role: ManagerRole) {
        this._role = role;
    }
}
