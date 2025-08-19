export class OrganizationAddress {
    private constructor(
       private readonly _city: string,
       private readonly _address: string,
       private readonly _latitude: number,
       private readonly _longitude: number
    ) {}

    static create(city: string, address: string, latitude: number, longitude: number) {
        return new OrganizationAddress(city, address, latitude, longitude)
    }

    get city() {return this._city}
    get address() {return this._address}
    get latitude() {return this._latitude}
    get longitude() {return this._longitude}
}
