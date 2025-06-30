import { UniqueID } from "@domain/common/unique-id";
import { EXCEPTION } from "@domain/common/exceptions/exceptions.const";
import {OrganizationCountRange, TariffFeatures} from "@domain/subscription/model/tariff-feature";
import {
  BASE_PRICE_PER_ORGANIZATION_RANGE_KZT,
  FEATURE_PRICES_KZT
} from "@domain/subscription/consts/tariff-prices.const";

export class TariffId extends UniqueID {}

export class Tariff {
  private constructor(
      private readonly _id: TariffId,
      private _isActive: boolean,
      private _price: number, // Поле price
      private _features: TariffFeatures,
  ) {
    if (this._price < 0) {
      throw new Error(EXCEPTION.TARIFF.INVALID_PRICE);
    }
  }

  static create(isActive: boolean, features: TariffFeatures, price: number = 0): Tariff {
    return new Tariff(new TariffId(), isActive, price, features);
  }

  static fromPersistence(
      id: string,
      isActive: boolean,
      price: number,
      features: TariffFeatures,
  ): Tariff {
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
    const activeFeatureNames: string[] = [];
    if (this._features.companyDataSync) activeFeatureNames.push('companyDataSync');
    if (this._features.multiAccess) activeFeatureNames.push('multiAccess');
    if (this._features.registerPlacement) activeFeatureNames.push('registerPlacement');
    if (this._features.reviewReply) activeFeatureNames.push('reviewReply');
    if (this._features.reviewAutoReply) activeFeatureNames.push('reviewAutoReply');
    if (this._features.reviewComplaint) activeFeatureNames.push('reviewComplaint');
    if (this._features.reviewAutoComplaint) activeFeatureNames.push('reviewAutoComplaint');
    if (this._features.analysisReview) activeFeatureNames.push('analysisReview');
    if (this._features.analysisByRadius) activeFeatureNames.push('analysisByRadius');
    if (this._features.analysisCompetitor) activeFeatureNames.push('analysisCompetitor');
    return activeFeatureNames;
  }

  set features(newFeatures: TariffFeatures) {
    if (!this._features.equals(newFeatures)) {
      this._features = newFeatures;
    }
  }

  set price(newPrice: number) {
    if (newPrice < 0) {
      throw new Error(EXCEPTION.TARIFF.INVALID_PRICE);
    }
    this._price = newPrice;
  }

  get id(): TariffId { return this._id; }
  get price(): number { return this._price; }
  get isActive(): boolean { return this._isActive; }
  get features(): TariffFeatures { return this._features; }

  public static calculatePriceBasedOnFeatures(
      features: TariffFeatures,
      organizationCountRange: OrganizationCountRange,
  ): number {
    let calculatedPrice = 0;

    const basePriceForRange = BASE_PRICE_PER_ORGANIZATION_RANGE_KZT[organizationCountRange];
    if (basePriceForRange === undefined) {
      console.error(`Invalid organization count range provided: ${organizationCountRange}`);
      throw new Error(`Invalid organization count range for price calculation.`);
    }
    calculatedPrice += basePriceForRange;

    if (features.companyDataSync) { calculatedPrice += FEATURE_PRICES_KZT.companyDataSync; }
    if (features.multiAccess) {
      calculatedPrice += FEATURE_PRICES_KZT.multiAccess;
    }
    if (features.registerPlacement) { calculatedPrice += FEATURE_PRICES_KZT.registerPlacement; }
    if (features.reviewReply) { calculatedPrice += FEATURE_PRICES_KZT.reviewReply; }
    if (features.reviewAutoReply) { calculatedPrice += FEATURE_PRICES_KZT.reviewAutoReply; }
    if (features.reviewComplaint) { calculatedPrice += FEATURE_PRICES_KZT.reviewComplaint; }
    if (features.reviewAutoComplaint) { calculatedPrice += FEATURE_PRICES_KZT.reviewAutoComplaint; }
    if (features.analysisReview) { calculatedPrice += FEATURE_PRICES_KZT.analysisReview; }
    if (features.analysisByRadius) { calculatedPrice += FEATURE_PRICES_KZT.analysisByRadius; }
    if (features.analysisCompetitor) { calculatedPrice += FEATURE_PRICES_KZT.analysisCompetitor; }

    return calculatedPrice;
  }

  public static createBasicTariff(
      organizationCountRange: OrganizationCountRange,
      isActive: boolean = true
  ): Tariff {
    const features = TariffFeatures.create(
        false, // companyDataSync
        false, // multiAccess
        false, // registerPlacement
        true,  // reviewReply (ручные ответы)
        false, // reviewAutoReply
        false, // reviewComplaint
        false, // reviewAutoComplaint
        true,  // analysisReview (базовая аналитика)
        false, // analysisByRadius
        false  // analysisCompetitor
    );
    // Вычисляем цену сразу при создании
    const price = Tariff.calculatePriceBasedOnFeatures(features, organizationCountRange);
    return Tariff.create(isActive, features, price);
  }


  public static createProTariff(
      organizationCountRange: OrganizationCountRange,
      isActive: boolean = true
  ): Tariff {
    const features = TariffFeatures.create(
        true,  // companyDataSync
        true,  // multiAccess (базовый)
        true,  // registerPlacement
        true,  // reviewReply
        true,  // reviewAutoReply
        true,  // reviewComplaint
        false, // reviewAutoComplaint
        true,  // analysisReview
        true,  // analysisByRadius
        false  // analysisCompetitor
    );
    const price = Tariff.calculatePriceBasedOnFeatures(features, organizationCountRange);
    return Tariff.create(isActive, features, price);
  }

  public static createProPlusTariff(
      organizationCountRange: OrganizationCountRange,
      isActive: boolean = true
  ): Tariff {
    const features = TariffFeatures.create(
        true,  // companyDataSync
        true,  // multiAccess
        true,  // registerPlacement
        true,  // reviewReply
        true,  // reviewAutoReply
        true,  // reviewComplaint
        true,  // reviewAutoComplaint
        true,  // analysisReview
        true,  // analysisByRadius
        true   // analysisCompetitor
    );
    const price = Tariff.calculatePriceBasedOnFeatures(features, organizationCountRange);
    return Tariff.create(isActive, features, price);
  }

  public static createCustomTariff(
      organizationCountRange: OrganizationCountRange,
      features: TariffFeatures,
      isActive: boolean = true
  ): Tariff {
    const price = Tariff.calculatePriceBasedOnFeatures(features, organizationCountRange);
    return Tariff.create(isActive, features, price);
  }
}
