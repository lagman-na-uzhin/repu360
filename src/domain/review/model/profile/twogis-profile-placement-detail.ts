export class TwogisProfilePlacementDetail {
    private constructor(private readonly _externalId: string) {}

    static create(externalId: string): TwogisProfilePlacementDetail {
        if (!externalId.trim()) {
            throw new Error("External ID cannot be empty");
        }
        return new TwogisProfilePlacementDetail(externalId);
    }

    static fromPersistence(externalId: string): TwogisProfilePlacementDetail {
        return new TwogisProfilePlacementDetail(externalId);
    }

    get externalId(): string {
        return this._externalId;
    }
}
