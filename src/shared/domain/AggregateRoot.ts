class AggregateRoot<T> extends Entity<T> {
    protected _version: number;

    constructor(id: T, version: number = 0) {
        super(id);
        this._version = version;
    }

    public getVersion(): number {
        return this._version;
    }

    protected incrementVersion(): void {
        this._version++;
    }
}
