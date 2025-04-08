import {TariffId} from "@domain/subscription/model/tariff";
import {CompanyId} from "@domain/company/company";
import {SubscriptionPeriod} from "@domain/subscription/value-object/subscription-period.vo";

export class CreateSubscriptionInput {
    constructor(
        public readonly tariffId: TariffId,
        public readonly companyId: CompanyId,
        public readonly period: SubscriptionPeriod,
    ) {}
}
