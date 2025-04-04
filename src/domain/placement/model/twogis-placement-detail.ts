export class TwogisPlacementDetail {
    private constructor(
      private _externalId: string,
      private _type: string // TODO: уточнить тип
    ) {}

    static create(externalId: string, type: string): TwogisPlacementDetail {
        return new TwogisPlacementDetail(externalId, type);
    }

    static fromPersistence(externalId: string, type: string): TwogisPlacementDetail {
        return new TwogisPlacementDetail(externalId, type);
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

    get type(): string {
        return this._type;
    }

    set type(value: string) {
        if (!value.trim()) {
            throw new Error("Type cannot be empty");
        }
        this._type = value;
    }
}
