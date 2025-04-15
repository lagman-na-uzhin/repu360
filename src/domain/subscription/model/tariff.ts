import { UniqueID } from "@domain/common/unique-id";
import { EXCEPTION } from "@domain/common/exceptions/exceptions.const";
import { TariffFeatures } from "@domain/subscription/model/tariff-feature";

export class TariffId extends UniqueID {}

export class Tariff {
  private constructor(
    private readonly _id: TariffId,
    private _isActive: boolean,
    private _price: number,
    private _features: TariffFeatures,

    private readonly _createdAt: Date = new Date(),
    private _updatedAt: Date | null = null,
    private _deletedAt: Date | null = null

  ) {}

  static create(isActive: boolean, price: number, _features: TariffFeatures) {
    return new Tariff(new TariffId(), isActive, price, _features);
  }

  static fromPersistence(id: string, isActive: boolean, price: number, startedAt: Date | string, features: TariffFeatures): Tariff {
    return new Tariff(new TariffId(id), isActive, price, features);

  }

  activate(): void {
    if (this._isActive) {
      throw new Error(EXCEPTION.TARIFF.ALREADY_ACTIVE);
    }
    this._isActive = true;
  }

  deactivate(): void {
    if (!this._isActive) {
      throw new Error(EXCEPTION.TARIFF.ALREADY_INACTIVE);
    }
    this._isActive = false;
  }

  getActiveFeatures(): ReadonlyArray<string> {
    return Object.entries(this._features)
        .filter(([_, isActive]: [string, boolean]) => isActive)
        .map(([feature]: [string, boolean]) => feature) as ReadonlyArray<string>;
  }

  set price(newPrice: number) {
    if (newPrice < 0) {
      throw new Error(EXCEPTION.TARIFF.INVALID_PRICE);
    }
    this._price = newPrice;
  }

  set isActive(status: boolean) {
    this._isActive = status;
  }

  set features(newFeatures: PartnerTariffFeatures) {
    this._features = newFeatures;
  }

  get id(): TariffId {
    return this._id;
  }

  get price(): number {
    return this._price;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get features(): PartnerTariffFeatures {
    return this._features;
  }
}
