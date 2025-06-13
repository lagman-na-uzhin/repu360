import {TariffId} from "@domain/subscription/model/tariff";
import {BaseCommand} from "@application/common/base-command";
import {CompanyId} from "@domain/company/company";
import {SubscriptionPeriod} from "@domain/subscription/value-object/subscription-period.vo";
import {Actor} from "@domain/policy/actor";

export class CreateSubscriptionCommand extends BaseCommand {
    private constructor(
        public readonly tariffId: TariffId,
        public readonly companyId: CompanyId,
        public readonly period: SubscriptionPeriod,
        actor: Actor
    ) {
        super(actor);
    }

    static of(dto: { tariffId: string, companyId: string, periodStart: Date, periodEnd: Date }, actor: Actor) {
        return new CreateSubscriptionCommand(
            new TariffId(dto.tariffId),
            new CompanyId(dto.companyId),
            SubscriptionPeriod.create(dto.periodStart, dto.periodEnd),
            actor);
    }
}
