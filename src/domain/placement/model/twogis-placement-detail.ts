import {TwogisCabinetCredentials} from "@domain/placement/value-object/twogis/twogis-cabinet-credentials.vo";

export class TwogisPlacementDetail {
    private constructor(
      private _externalId: string,
      private _type: string, // TODO: уточнить тип
      private _cabinet_credentials: TwogisCabinetCredentials | null
    ) {}

    static create(externalId: string, type: string, cabinetCredentials: TwogisCabinetCredentials | null): TwogisPlacementDetail {
        return new TwogisPlacementDetail(externalId, type, cabinetCredentials);
    }

    static fromPersistence(
        externalId: string,
        type: string,
        login?: string,
        password?: string
    ): TwogisPlacementDetail {
        return new TwogisPlacementDetail(
            externalId,
            type,
            login && password ? new TwogisCabinetCredentials(login!, password!) : null
        );
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

    get cabinetCredentials() {
        return this._cabinet_credentials;
    }

    clearCabinetCredentials() {
        this._cabinet_credentials = null;
    }
}
