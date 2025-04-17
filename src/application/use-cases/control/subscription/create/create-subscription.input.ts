import {TariffId} from "@domain/subscription/model/tariff";
import {CompanyId} from "@domain/company/company";
import {SubscriptionPeriod} from "@domain/subscription/value-object/subscription-period.vo";
import {BaseCommand} from "@application/common/base-command";

export class CreateSubscriptionCommand extends BaseCommand{
    private constructor(
        public readonly tariffId: TariffId,
        public readonly companyId: CompanyId,
        public readonly period: SubscriptionPeriod,
    ) {}

    static of(tariffId: TariffId, companyId: Com) {
        return new CreateSubscriptionCommand()
    }
}
