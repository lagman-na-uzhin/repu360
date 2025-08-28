class Entity<T> {
    protected _id: T;

    constructor(id: T) {
        if (id === null || id === undefined) {
            throw new Error("ID is null");
        }
        this._id = id;
    }

    public equals(other: Entity<T>): boolean {
        if (other === null || other === undefined) {
            return false;
        }
        return this._id === other._id;
    }
}
