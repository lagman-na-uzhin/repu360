export class OrganizationAddress {
    private readonly _country: string;
    private readonly _region: string;
    private readonly _district: string; // Можно переименовать в 'city' или 'locality' если это более универсально
    private readonly _street: string;
    private readonly _buildingNumber: string; // Изменено на string для поддержки номеров типа '10А'
    private readonly _apartmentNumber?: string; // Опционально: номер квартиры/офиса
    private readonly _zipCode?: string; // Опционально: почтовый индекс

    private constructor(
        country: string,
        region: string,
        district: string,
        street: string,
        buildingNumber: string,
        apartmentNumber?: string,
        zipCode?: string
    ) {
        // Валидация обязательных полей
        if (!country || country.trim() === '') {
            throw new Error('Country cannot be empty.');
        }
        if (!region || region.trim() === '') {
            throw new Error('Region cannot be empty.');
        }
        if (!district || district.trim() === '') {
            throw new Error('District/City cannot be empty.');
        }
        if (!street || street.trim() === '') {
            throw new Error('Street cannot be empty.');
        }
        if (!buildingNumber || buildingNumber.trim() === '') {
            throw new Error('Building number cannot be empty.');
        }

        this._country = country.trim();
        this._region = region.trim();
        this._district = district.trim();
        this._street = street.trim();
        this._buildingNumber = buildingNumber.trim();
        this._apartmentNumber = apartmentNumber ? apartmentNumber.trim() : undefined;
        this._zipCode = zipCode ? zipCode.trim() : undefined;
    }

    public static create(
        country: string,
        region: string,
        district: string,
        street: string,
        buildingNumber: string,
        apartmentNumber?: string,
        zipCode?: string
    ): OrganizationAddress {
        return new OrganizationAddress(country, region, district, street, buildingNumber, apartmentNumber, zipCode);
    }

    public get country(): string {
        return this._country;
    }

    public get region(): string {
        return this._region;
    }

    public get district(): string {
        return this._district;
    }

    public get street(): string {
        return this._street;
    }

    public get buildingNumber(): string {
        return this._buildingNumber;
    }

    public get apartmentNumber(): string | undefined {
        return this._apartmentNumber;
    }

    public get zipCode(): string | undefined {
        return this._zipCode;
    }

    public equals(other: OrganizationAddress): boolean {
        if (!(other instanceof OrganizationAddress)) {
            return false;
        }
        return (
            this._country === other._country &&
            this._region === other._region &&
            this._district === other._district &&
            this._street === other._street &&
            this._buildingNumber === other._buildingNumber &&
            this._apartmentNumber === other._apartmentNumber &&
            this._zipCode === other._zipCode
        );
    }

    public toString(): string {
        let address = `${this._zipCode ? `${this._zipCode}, ` : ''}${this._country}, ${this._region}, ${this._district}, ${this._street}, ${this._buildingNumber}`;
        if (this._apartmentNumber) {
            address += `, ${this._apartmentNumber}`;
        }
        return address;
    }
}
