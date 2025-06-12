import { Injectable } from '@nestjs/common';
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager, Equal} from "typeorm";
import {ISubscriptionRepository} from "@domain/subscription/repositories/subscription-repository.interface";

@Injectable()
export class SubscriptionOrmRepository implements ISubscriptionRepository {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
    ) {}

    async save(subscription: Subscription): Promise<void> {
        return Promise.resolve(undefined);
    }

}
