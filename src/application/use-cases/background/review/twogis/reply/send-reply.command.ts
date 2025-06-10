export class TwogisSendReplyCommand {
    private constructor(
        public readonly placementId: string,
        public readonly reviewId: string,
        public readonly companyId: string,
    ) {}

    public static of(placementId: string, reviewId: string, companyId: string) {
        return new TwogisSendReplyCommand(placementId, reviewId, companyId);
    }
}
