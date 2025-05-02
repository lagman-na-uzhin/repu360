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

    static of(dto: { tariffId: TariffId, companyId: CompanyId, period: SubscriptionPeriod, actor: Actor }) {
        const { tariffId, companyId, period, actor } = dto;
        return new CreateSubscriptionCommand(tariffId, companyId, period, actor);
    }
}
