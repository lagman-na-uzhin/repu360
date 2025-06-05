import {ReviewId} from "@domain/review/review";
import {PlacementId} from "@domain/placement/placement";
import {CompanyId} from "@domain/company/company";

export class TwogisSendReplyCommand {
    private constructor(
        public readonly placementId: PlacementId,
        public readonly reviewId: ReviewId,
        public readonly companyId: CompanyId,
    ) {}

    public static of(placementId: PlacementId, reviewId: ReviewId, companyId: CompanyId) {
        return new TwogisSendReplyCommand(placementId, reviewId, companyId);
    }
}
