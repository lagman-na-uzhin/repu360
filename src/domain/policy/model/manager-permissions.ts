

export class ManagerPermissions {
    private constructor(
        private readonly _companies: Set<string> = new Set(),
    ) {}


    static fromPersistence(companies: Set<string>) {
        return new ManagerPermissions(companies);
    }

    get companies() {
        return this._companies;
    }
}
