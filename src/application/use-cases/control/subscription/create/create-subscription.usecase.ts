import { ICompanyRepository } from '@domain/company/repositories/company-repository.interface';
import {CreateSubscriptionCommand} from "@application/use-cases/control/subscription/create/create-subscription.command";
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";
import {ITariffRepository} from "@domain/subscription/repositories/tariff-repository.interface";
import {Subscription} from "@domain/subscription/subscription";
import {ISubscriptionRepository} from "@domain/subscription/repositories/subscription-repository.interface";

export class CreateSubscriptionUseCase {
    constructor(
        private readonly companyRepo: ICompanyRepository,
        private readonly tariffRepo: ITariffRepository,
        private readonly subscriptionRepo: ISubscriptionRepository
    ) {}

    async execute(command: CreateSubscriptionCommand): Promise<void> {
        const company = await this.companyRepo.getById(command.companyId);
        if (!company) throw new Error(EXCEPTION.COMPANY.NOT_FOUND);

        const tariff = await this.tariffRepo.getById(command.tariffId);
        if (!tariff) throw new Error(EXCEPTION.TARIFF.NOT_FOUND);

        const subscription = Subscription.create(company.id, tariff, command.period);

        await this.subscriptionRepo.save(subscription);
    }
}
