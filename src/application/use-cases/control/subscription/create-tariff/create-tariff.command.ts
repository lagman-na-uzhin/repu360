import {BaseCommand} from "@application/common/base-command";
import {Actor} from "@domain/policy/actor";

class Features {
    constructor(
         companyDataSync: boolean,
         multiAccess: boolean,
         registerPlacement: boolean,
         reviewAutoReply: boolean,
         reviewComplaint: boolean,
         reviewAutoComplaint: boolean,
         analysisReview: boolean,
         analysisByRadius: boolean,
         analysisCompetitor: boolean
    ) {}
}
export class CreateTariffCommand extends BaseCommand {
    private constructor(
        public readonly price: number,
        public readonly features: Features,
        actor: Actor
    ) {
        super(actor);
    }

    static of() {
        return new CreateTariffCommand();
    }
}
