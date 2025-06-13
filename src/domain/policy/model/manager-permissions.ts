

export class ManagerPermissions {
    private constructor(
        private readonly _companies: Set<string> = new Set(),
        private readonly _leads: Set<string> = new Set(),
    ) {}


    static fromPersistence(companies: Set<string>, leads: Set<string>) {
        return new ManagerPermissions(companies, leads);
    }

    get companies() {return this._companies;}
    get leads() {return this._leads;}
}
