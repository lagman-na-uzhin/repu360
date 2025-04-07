import {UniqueEntityID} from '@domain/common/unique-id';
import {Employee} from '@domain/company/model/employee/employee';
import {Tariff} from '@domain/company/model/tariff/tariff';
import {ManagerId} from "@domain/manager/manager";
import {EmployeeRole} from "@domain/company/model/employee/employee-role";
import {CompanyName} from "@domain/company/value-object/company-name.vo";
import {EmployeeName} from "@domain/company/value-object/employee-user-name.vo";
import {EmployeeEmail} from "@domain/company/value-object/employee-email.vo";
import {EmployeePhone} from "@domain/company/value-object/employee-user-phone.vo";
import {EmployeePassword} from "@domain/company/value-object/employee-user-password.vo";
import {EmployeePermissions} from "@domain/company/types/employee-permissions.types";
import {EMPLOYEE_TYPE} from "@domain/company/types/employee-type.types";

export class CompanyId extends UniqueEntityID {}

export class Company {
    private constructor(
      private readonly _id: CompanyId,
      private readonly managerId: ManagerId,
      private _name: CompanyName,
      private _tariff: Tariff,
      private employees: Employee[] = []
    ) {}

    static create(
        managerId: ManagerId,
        name: CompanyName,
        tariff: Tariff,
        ownerName: EmployeeName,
        ownerEmail: EmployeeEmail,
        ownerPhone: EmployeePhone,
        ownerPassword: EmployeePassword,
        ownerAvatar: string | null
    ): Company {
        const activeFeatures = tariff.getActiveFeatures();

        const ownerPermissionsSet = new Set<EmployeePermissions>();

        activeFeatures.forEach((feature) => {
            const permissions = EmployeePermissions[feature as keyof typeof EmployeePermissions];

            permissions.forEach((permission) => ownerPermissionsSet.add(permission as EmployeePermissions));
        });

        const ownerPermissions = Array.from(ownerPermissionsSet);

        const ownerRole = EmployeeRole.create(EMPLOYEE_TYPE.OWNER, ownerPermissions);

        const owner = Employee.create(ownerRole, ownerName, ownerEmail, ownerPhone, ownerPassword, ownerAvatar);

        return new Company(new CompanyId(), managerId, name, tariff, [owner]);
    }

    static fromPersistence(id: string, managerId: string, name: string, tariff: Tariff, employees: Employee[]): Company {
        return new Company(new CompanyId(id), new ManagerId(managerId), new CompanyName(name), tariff, employees);
    }


    set companyName(name: CompanyName) {
        this._name = name;
    }

    set tariff(newTariff: Tariff) {
        this._tariff = newTariff;
    }

    get employees(): Employee[] {
        return this.employees;
    }

    get tariff(): Tariff | null {
        return this._tariff;
    }

    get id(): CompanyId {
        return this._id;
    }

    get name(): CompanyName {
        return this._name;
    }
}
