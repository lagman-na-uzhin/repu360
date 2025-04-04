export class TwogisReviewPlacementDetail {
    private constructor(private readonly _externalId: string) {}

    static create(externalId: string): TwogisReviewPlacementDetail {
        if (!externalId.trim()) {
            throw new Error("External ID cannot be empty");
        }
        return new TwogisReviewPlacementDetail(externalId);
    }

    static fromPersistence(externalId: string): TwogisReviewPlacementDetail {
        return new TwogisReviewPlacementDetail(externalId);
    }

    get externalId(): string {
        return this._externalId;
    }
}
