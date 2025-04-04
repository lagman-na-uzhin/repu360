export class YandexPlacementDetail {
    private constructor(private _externalId: string) {}

    static create(externalId: string): YandexPlacementDetail {
        return new YandexPlacementDetail(externalId);
    }

    static fromPersistence(externalId: string): YandexPlacementDetail {
        return new YandexPlacementDetail(externalId)
    }

    get externalId(): string {
        return this._externalId;
    }

    set externalId(value: string) {
        if (!value.trim()) {
            throw new Error("External ID cannot be empty");
        }
        this._externalId = value;
    }
}
