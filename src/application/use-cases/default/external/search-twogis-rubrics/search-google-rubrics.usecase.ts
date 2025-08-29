import {ITwogisSession} from "@application/interfaces/integrations/twogis/twogis-session.interface";
import {IPlacementRepository} from "@domain/placement/repositories/placement-repository.interface";
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";

export class SearchGoogleRubricsUseCase {
    constructor(
        private readonly twogisSession: ITwogisSession,
        private readonly placementRepo: IPlacementRepository
    ) {}

    async execute(query) {
        const placement = await this.placementRepo.getTwogisByOrgId(query.organizationId);
        if (!placement) throw new Error(EXCEPTION.PLACEMENT.TWOGIS_NOT_FOUND);

        console.log(placement, "place")
        const cabinetCredentials = placement.getTwogisPlacementDetail().cabinetCredentials;
        console.log(cabinetCredentials, "cab")
        if (!cabinetCredentials) throw new Error(EXCEPTION.PLACEMENT.TWOGIS_INVALID_CABINET_CREDENTIALS);

        await this.twogisSession.init(query.companyId, cabinetCredentials);

        return this.twogisSession.searchRubrics(query.text)
    }
}
