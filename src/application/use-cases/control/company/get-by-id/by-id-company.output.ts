import {CompanyId} from "@domain/company/company";
import {ManagerId} from "@domain/manager/manager";
import {SubscriptionId} from "@domain/subscription/subscription";
import {CompanyName} from "@domain/company/value-object/company-name.vo";

export class ByIdCompanyControlOutput {
    private constructor(
        public readonly id: string,
        public readonly managerId: string,
        public readonly subscriptionId: string | null,
        public readonly name: string,
    ) {}

    static of(
        id: CompanyId,
        managerId: ManagerId,
        subscriptionId: SubscriptionId | null,
        name: CompanyName,
    ) {
        return new ByIdCompanyControlOutput(
            id.toString(),
            managerId.toString(),
            subscriptionId ? subscriptionId.toString() : null,
            name.toString()
        )
    }
}
