export class ReviewMedia {
    private constructor(private readonly _url: string, private readonly _dateCreated: Date) {}

    static create(url: string, dateCreated: Date): ReviewMedia {
        if (!url.trim()) {
            throw new Error("URL cannot be empty");
        }
        if (!(dateCreated instanceof Date) || isNaN(dateCreated.getTime())) {
            throw new Error("Invalid date");
        }
        return new ReviewMedia(url, dateCreated);
    }

    static fromPersistence(url: string, dateCreated: Date) {
        return new ReviewMedia(url, dateCreated);
    }

    get url(): string {
        return this._url;
    }

    get dateCreated(): Date {
        return this._dateCreated;
    }
}
