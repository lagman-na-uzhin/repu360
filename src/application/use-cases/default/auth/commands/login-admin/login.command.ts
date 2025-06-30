import {ManagerEmail} from "@domain/manager/value-object/manager-email.vo";
import {ManagerPassword} from "@domain/manager/value-object/manager-password.vo";

export class ManagerLoginCommand {
    constructor(
        public readonly email: ManagerEmail,
        public readonly password: ManagerPassword
    ) {}

    static of( dto: {email: ManagerEmail, password: ManagerPassword}) {
        return new ManagerLoginCommand(dto.email, dto.password);
    }
}
