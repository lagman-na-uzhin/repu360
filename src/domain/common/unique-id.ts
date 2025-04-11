import { v4 as uuidv4 } from "uuid";

export class UniqueID {
    private readonly value: string;

    constructor(id?: string) {
        this.value = id ?? uuidv4();
    }

    toString(): string {
        return this.value;
    }
}
