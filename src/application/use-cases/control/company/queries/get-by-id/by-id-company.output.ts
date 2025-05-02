import {CompanyId} from "@domain/company/company";
import {ManagerId} from "@domain/manager/manager";
import {SubscriptionId} from "@domain/subscription/subscription";
import {CompanyName} from "@domain/company/value-object/company-name.vo";

export class ByIdCompanyControlOutput {
    private constructor(
        public readonly id: string,
        public readonly managerId: string,
        public readonly name: string,
    ) {}

    static of(
        domain: {
            id: CompanyId,
            managerId: ManagerId,
            name: CompanyName,
        }
    ) {
        return new ByIdCompanyControlOutput(
            domain.id.toString(),
            domain.managerId.toString(),
            domain.name.toString()
        )
    }
}
