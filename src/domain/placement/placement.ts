import { UniqueID } from '@domain/common/unique-id';
import { OrganizationId } from '@domain/organization/organization';
import { YandexPlacementDetail } from '@domain/placement/model/yandex-placement-detail';
import { TwogisPlacementDetail } from '@domain/placement/model/twogis-placement-detail';
import { PLATFORMS } from '@domain/common/platfoms.enum';
import { PlacementDetail } from "@domain/placement/types/placement-detail.types";

export class PlacementId extends UniqueID {}

export class Placement {
    private constructor(
      private readonly _id: PlacementId,
      private readonly _organization_id: OrganizationId,
      private readonly _external_id: string,
      private _platform: PLATFORMS,
      private _rating: number,
      private _placement_detail: PlacementDetail,
      // private readonly _createdAt: Date = new Date(),
      // private _updatedAt: Date | null = null,
      // private _deletedAt: Date | null = null
    ) {}

    static create(
      organizationId: OrganizationId,
      platform: PLATFORMS,
      externalId: string,
      rating: number,
      placementDetail: PlacementDetail
    ): Placement {
        Placement.validatePlacementDetail(platform, placementDetail);

        return new Placement(new PlacementId(), organizationId, externalId, platform, rating, placementDetail);
    }

    static fromPersistence(
      id: string,
      organizationId: string,
      platform: PLATFORMS,
      externalId: string,
      rating: number,
      placementDetail: PlacementDetail
    ): Placement {
        Placement.validatePlacementDetail(platform, placementDetail);

        return new Placement(new PlacementId(id), new OrganizationId(organizationId), externalId, platform, rating, placementDetail);
    }

    getYandexPlacementDetail(): YandexPlacementDetail {
        return this.getPlacementDetail(YandexPlacementDetail.prototype);
    }

    getTwogisPlacementDetail(): TwogisPlacementDetail {
        return this.getPlacementDetail(TwogisPlacementDetail.prototype);
    }


    get id(): PlacementId {
        return this._id;
    }

    get organizationId(): OrganizationId {
        return this._organization_id;
    }

    get platform(): PLATFORMS {
        return this._platform;
    }

    set platform(value: PLATFORMS) {
        this._platform = value;
    }

    get placementDetail(): PlacementDetail {
        return this._placement_detail;
    }

    get externalId() {return this._external_id}

    get rating(): number {return this._rating;}

    set rating(rating: number) {this._rating = rating;}

    set placementDetail(value: PlacementDetail) {
        Placement.validatePlacementDetail(this._platform, value);
        this._placement_detail = value;
    }

    private static validatePlacementDetail(platform: PLATFORMS, placementDetail: PlacementDetail) {
        if (platform === PLATFORMS.TWOGIS && !(placementDetail instanceof TwogisPlacementDetail)) {
            throw new Error('Invalid placement detail for TWOGIS placement-details');
        }
        if (platform === PLATFORMS.YANDEX && !(placementDetail instanceof YandexPlacementDetail)) {
            throw new Error('Invalid placement detail for YANDEX placement-details');
        }
    }

    private getPlacementDetail<T extends PlacementDetail>(expectedInstance: T): T {
        if (this._placement_detail instanceof expectedInstance.constructor) {
            return this._placement_detail as T;
        }
        throw new Error(`Invalid placement detail type for platform: ${this._platform}`);
    }

}
