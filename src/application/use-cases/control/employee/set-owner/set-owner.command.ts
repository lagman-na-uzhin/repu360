import {Manager} from "@domain/manager/manager";
import {CompanyId} from "@domain/company/company";
import {EmployeeName} from "@domain/employee/value-object/employee-name.vo";
import {EmployeeEmail} from "@domain/employee/value-object/employee-email.vo";
import {EmployeePhone} from "@domain/employee/value-object/employee-phone.vo";
import {BaseCommand} from "@application/common/base-command/base-command";
import {Actor} from "@domain/policy/actor";

export class SetOwnerCommand extends BaseCommand {
    private constructor(
        public readonly companyId: CompanyId,
        public readonly ownerName: EmployeeName,
        public readonly ownerEmail: EmployeeEmail,
        public readonly ownerPhone: EmployeePhone,
        actor: Actor
    ) {
        super(actor);
    }

    public static of(companyId: string, ownerName: string, ownerEmail: string, ownerPhone: string, actor: Actor) {
        return new SetOwnerCommand(
            new CompanyId(companyId),
            new EmployeeName(ownerName),
            new EmployeeEmail(ownerEmail),
            new EmployeePhone(ownerPhone),
            actor
        );
    }
}
