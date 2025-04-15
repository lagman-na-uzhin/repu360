import {BaseManagerInput} from "@application/common/base-command/base-manager-command";
import {Manager} from "@domain/manager/manager";
import {CompanyId} from "@domain/company/company";
import {EmployeeName} from "@domain/employee/value-object/employee-name.vo";
import {EmployeeEmail} from "@domain/employee/value-object/employee-email.vo";
import {EmployeePhone} from "@domain/employee/value-object/employee-phone.vo";

export class SetOwnerInput extends BaseManagerInput {
    private constructor(
        public readonly companyId: CompanyId,
        public readonly ownerName: EmployeeName,
        public readonly ownerEmail: EmployeeEmail,
        public readonly ownerPhone: EmployeePhone,
        manager: Manager
    ) {
        super(manager);
    }

    public static of(companyId: string, ownerName: string, ownerEmail: string, ownerPhone: string, manager: Manager) {
        return new SetOwnerInput(
            new CompanyId(companyId),
            new EmployeeName(ownerName),
            new EmployeeEmail(ownerEmail),
            new EmployeePhone(ownerPhone),
            manager
        );
    }
}
