import {BaseCommand} from "@application/common/base-command";
import {Actor} from "@domain/policy/actor";

export class CreateTariffCommand extends BaseCommand {
    private constructor(
        public readonly price: number,
        public readonly features: {
            companyDataSync: boolean,
            multiAccess: boolean,
            registerPlacement: boolean,
            reviewReply: boolean,
            reviewAutoReply: boolean,
            reviewComplaint: boolean,
            reviewAutoComplaint: boolean,
            analysisReview: boolean,
            analysisByRadius: boolean,
            analysisCompetitor: boolean
        },
        actor: Actor
    ) {
        super(actor);
    }

    static of(dto: {
        price: number,
        features: {
            companyDataSync: boolean,
            multiAccess: boolean,
            registerPlacement: boolean,
            reviewReply: boolean,
            reviewAutoReply: boolean,
            reviewComplaint: boolean,
            reviewAutoComplaint: boolean,
            analysisReview: boolean,
            analysisByRadius: boolean,
            analysisCompetitor: boolean
        }},
              actor: Actor) {
        return new CreateTariffCommand(dto.price,  dto.features, actor);
    }
}
