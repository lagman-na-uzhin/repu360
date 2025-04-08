import {Subscription} from "@domain/subscription/subscription";

export interface ISubscriptionRepository {
    save(subscription: Subscription): Promise<void>
}
