import { UniqueEntityID } from "@domain/common/unique-id";
import { EXCEPTION } from "@domain/common/exceptions/exceptions.const";
import { PartnerTariffFeatures } from "@domain/partner/model/tariff/partner-tariff-feature";
import { PartnerId } from "@domain/partner/partner";

export class PartnerTariffId extends UniqueEntityID {}

export class PartnerTariff {
  private constructor(
    private readonly _id: PartnerTariffId,
    private readonly _partnerId: PartnerId,
    private _isActive: boolean,
    private _price: number,
    private _startedAt: Date,
    private _features: PartnerTariffFeatures
  ) {}

  static fromPersistence(id: string, partnerId: string, isActive: boolean, price: number, startedAt: Date | string, features: PartnerTariffFeatures): PartnerTariff {
    return new PartnerTariff(new PartnerTariffId(id), new PartnerId(partnerId), isActive, price, new Date(startedAt), features);

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

  get id(): PartnerTariffId {
    return this._id;
  }

  get partnerId(): PartnerId {
    return this._partnerId;
  }

  get startedAt(): Date {
    return this._startedAt;
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
