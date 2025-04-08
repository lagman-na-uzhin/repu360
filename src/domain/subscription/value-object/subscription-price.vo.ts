import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";

export class SubscriptionPrice {
    private readonly _value: number;

    constructor(price: number) {
        if (!SubscriptionPrice.isValid(price)) {
            throw new Error(EXCEPTION.SUBSCRIPTION.INVALID_PRICE);
        }
        this._value = price;
    }

    private static isValid(price: number): boolean {
        return price > 0;
    }

    toNumber(): number {
        return this._value;
    }
}
