import {TwogisCabinetCredentials} from "@domain/placement/value-object/twogis/twogis-cabinet-credentials.vo";

export class TwogisPlacementDetail {
    private constructor(
      private _cabinet_credentials: TwogisCabinetCredentials | null
    ) {}

    static create( cabinetCredentials: TwogisCabinetCredentials | null): TwogisPlacementDetail {
        return new TwogisPlacementDetail(cabinetCredentials);
    }

    static fromPersistence(
        login?: string,
        password?: string
    ): TwogisPlacementDetail {
        return new TwogisPlacementDetail(
            (login && password) ? new TwogisCabinetCredentials(login!, password!) : null
        );
    }

    get cabinetCredentials() {
        return this._cabinet_credentials;
    }

    clearCabinetCredentials() {
        this._cabinet_credentials = null;
    }
}
