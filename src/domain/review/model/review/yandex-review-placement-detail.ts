export class YandexReviewPlacementDetail {
    private constructor(private readonly _externalId: string) {}

    static create(externalId: string): YandexReviewPlacementDetail {
        if (!externalId.trim()) {
            throw new Error("External ID cannot be empty");
        }
        return new YandexReviewPlacementDetail(externalId);
    }

    static fromPersistence(externalId: string): YandexReviewPlacementDetail {
        return new YandexReviewPlacementDetail(externalId);
    }

    get externalId(): string {
        return this._externalId;
    }
}
