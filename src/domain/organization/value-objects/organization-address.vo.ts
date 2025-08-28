export class OrganizationAddress {
    private constructor(
        private readonly _country: string,
        private readonly _city: string,
        private readonly _district: string,
        private readonly _street: string,
        private readonly _housenumber: string,
        private readonly _latitude: number,
        private readonly _longitude: number
    ) {}

    static create(
        country: string,
        city: string,
        district: string,
        street: string,
        housenumber: string,
        latitude: number,
        longitude: number,
      ): OrganizationAddress {
        return new OrganizationAddress(country, city, district, street, housenumber, latitude, longitude);
    }

    static fromPersistence(country: string, city: string, district: string, street: string, housenumber: string, latitude: number, longitude: number) {
        return new OrganizationAddress(country, city, district, street, housenumber, latitude, longitude);
    }

    get country(): string {
        return this._country;
    }

    get city(): string {
        return this._city;
    }

    get district(): string {
        return this._district;
    }

    get street(): string {
        return this._street;
    }

    get housenumber(): string {
        return this._housenumber;
    }

    get latitude(): number {
        return this._latitude;
    }

    get longitude(): number {
        return this._longitude;
    }

    get fullAddress(): string {
        return `${this._country}, ${this._city}, ${this._district}, ${this._street}, ${this._housenumber}`;
    }
}
