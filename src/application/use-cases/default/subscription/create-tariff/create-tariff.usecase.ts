import {ITariffRepository} from "@domain/subscription/repositories/tariff-repository.interface";
import {CreateTariffCommand} from "@application/use-cases/default/subscription/create-tariff/create-tariff.command";
import {TariffFeatures} from "@domain/subscription/model/tariff-feature";
import {Tariff} from "@domain/subscription/model/tariff";

export class CreateTariffUseCase {
    constructor(
        private readonly tariffRepo: ITariffRepository,
    ) {}

    async execute(cmd: CreateTariffCommand): Promise<void> {
        const features = this.createTariffFeatures(cmd);

        const tariff = Tariff.create(true, features);

        await this.tariffRepo.save(tariff);
    }

    private createTariffFeatures(cmd: CreateTariffCommand) {
        const companyDataSync = cmd.features.companyDataSync;
        const multiAccess = cmd.features.multiAccess;
        const registerPlacement = cmd.features.registerPlacement;
        const reviewReply = cmd.features.reviewReply;
        const reviewAutoReply = cmd.features.reviewAutoReply;
        const reviewComplaint = cmd.features.reviewComplaint;
        const reviewAutoComplaint = cmd.features.reviewAutoComplaint;
        const analysisReview = cmd.features.analysisReview;
        const analysisByRadius = cmd.features.analysisByRadius;
        const analysisCompetitor = cmd.features.analysisCompetitor;

        return TariffFeatures.create(
            companyDataSync,
            multiAccess,
            registerPlacement,
            reviewReply,
            reviewAutoReply,
            reviewComplaint,
            reviewAutoComplaint,
            analysisReview,
            analysisByRadius,
            analysisCompetitor
        );
    }
}
