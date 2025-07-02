import {TwogisCabinetCredentials} from "@domain/placement/value-object/twogis/twogis-cabinet-credentials.vo";

export class TwogisPlacementDetail {
    private constructor(
      private _type: string, // TODO: уточнить тип
      private _cabinet_credentials: TwogisCabinetCredentials | null
    ) {}

    static create(type: string, cabinetCredentials: TwogisCabinetCredentials | null): TwogisPlacementDetail {
        return new TwogisPlacementDetail(type, cabinetCredentials);
    }

    static fromPersistence(
        type: string,
        login?: string,
        password?: string
    ): TwogisPlacementDetail {
        return new TwogisPlacementDetail(
            type,
            (login && password) ? new TwogisCabinetCredentials(login!, password!) : null
        );
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
