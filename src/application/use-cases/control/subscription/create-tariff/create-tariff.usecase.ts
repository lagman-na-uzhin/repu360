import { ICompanyRepository } from '@domain/company/repositories/company-repository.interface';
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";
import {ITariffRepository} from "@domain/subscription/repositories/tariff-repository.interface";
import {Subscription} from "@domain/subscription/subscription";
import {ISubscriptionRepository} from "@domain/subscription/repositories/subscription-repository.interface";
import {CreateTariffCommand} from "@application/use-cases/control/subscription/create-tariff/create-tariff.command";
import {TariffFeatures} from "@domain/subscription/model/tariff-feature";

export class CreateTariffUseCase {
    constructor(
        private readonly companyRepo: ICompanyRepository,
        private readonly tariffRepo: ITariffRepository,
        private readonly subscriptionRepo: ISubscriptionRepository
    ) {}

    async execute(cmd: CreateTariffCommand): Promise<void> {
        const features = TariffFeatures.create(
            cmd.
        )



        await this.subscriptionRepo.save(subscription);
    }
}
