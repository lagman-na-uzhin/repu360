import {UniqueID} from "@domain/common/unique-id";
import {Tariff} from "@domain/subscription/model/tariff";
import {CompanyId} from "@domain/company/company";
import {SubscriptionPeriod} from "@domain/subscription/value-object/subscription-period.vo";
import {SubscriptionPrice} from "@domain/subscription/value-object/subscription-price.vo";

export class SubscriptionId extends UniqueID {}

export class Subscription {
    private constructor(
        private readonly _id: SubscriptionId,
        private readonly _companyId: CompanyId,
        private readonly _tariff: Tariff,
        private _isExpire: boolean,
        private _price: SubscriptionPrice,
        private _period: SubscriptionPeriod,
        private _frozenAt: Date | null = null,

        private readonly _createdAt: Date = new Date(),
        private _updatedAt: Date | null = null,
        private _deletedAt: Date | null = null
    ) {}

    static create(
        companyId: CompanyId,
        tariff: Tariff,
        period: SubscriptionPeriod,
    ): Subscription {
        const price = this.calculatePrice(tariff.price, period)
        return new Subscription(new SubscriptionId(), companyId, tariff, false, price, period);
    }

    expired() {
        this._isExpire = true;
    }

    private static calculatePrice(tariffPrice: number, period: SubscriptionPeriod) {
        return new SubscriptionPrice((period.getDays() / 30) * tariffPrice);
    }
}

