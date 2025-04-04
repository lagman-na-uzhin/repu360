export class YandexProfilePlacementDetail {
    private constructor(private readonly _externalId: string) {}

    static create(externalId: string): YandexProfilePlacementDetail {
        if (!externalId.trim()) {
            throw new Error("External ID cannot be empty");
        }
        return new YandexProfilePlacementDetail(externalId);
    }

    static fromPersistence(externalId: string): YandexProfilePlacementDetail {
        return new YandexProfilePlacementDetail(externalId);
    }

    get externalId(): string {
        return this._externalId;
    }
}
