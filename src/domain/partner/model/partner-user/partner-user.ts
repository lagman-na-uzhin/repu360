import { UniqueEntityID } from "@domain/common/unique-id";
import { PartnerUserName } from '@domain/partner/value-object/partner-user-name.vo';
import { PartnerUserEmail } from '@domain/partner/value-object/partner-user-email.vo';
import { PartnerUserPhone } from '@domain/partner/value-object/partner-user-phone.vo';
import { PartnerUserPassword } from '@domain/partner/value-object/partner-user-password.vo';
import { PartnerUserRole } from "@domain/partner/model/partner-user/partner-user-role";

export class PartnerUserId extends UniqueEntityID {}

export class PartnerUser {
    private constructor(
      private readonly _id: PartnerUserId,
      private readonly _role: PartnerUserRole,
      private _name: PartnerUserName,
      private _email: PartnerUserEmail,
      private _phone: PartnerUserPhone,
      private _password: PartnerUserPassword,
      private _avatar: string | null
    ) {}

    static create(
      role: PartnerUserRole,
      name: PartnerUserName,
      email: PartnerUserEmail,
      phone: PartnerUserPhone,
      password: PartnerUserPassword,
      avatar: string | null
    ): PartnerUser {
        return new PartnerUser(
          new PartnerUserId(),
          role,
          name,
          email,
          phone,
          password,
          avatar
        )
    }

    static fromPersistence(id: string, role: PartnerUserRole, partnerId: string, name: string, email: string,  phone: string,password: string, avatar: string | null): PartnerUser {
        return new PartnerUser(
          new PartnerUserId(id),
          role,
          new PartnerUserName(name),
          new PartnerUserEmail(email),
          new PartnerUserPhone(phone),
          new PartnerUserPassword(password),
          avatar
        )
    }

    set name(newName: PartnerUserName) {
        this._name = newName;
    }

    set email(newEmail: PartnerUserEmail) {
        this._email = newEmail;
    }

    set phone(newPhone: PartnerUserPhone) {
        this._phone = newPhone;
    }

    get password(): PartnerUserPassword {
        return this._password;
    }

    set password(newPassword: PartnerUserPassword) {
        this._password = newPassword;
    }

    set avatar(newAvatar: string | null) {
        this._avatar = newAvatar;
    }

    get id(): PartnerUserId {
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

    get role(): PartnerUserRole {
        return this.role;
    }
}
