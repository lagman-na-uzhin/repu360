import { UniqueEntityID } from '@domain/common/unique-id';
import { OrganizationId } from '@domain/organization/organization';
import { YandexPlacementDetail } from '@domain/placement/model/yandex-placement-detail';
import { TwogisPlacementDetail } from '@domain/placement/model/twogis-placement-detail';
import { Platform } from '@domain/placement/types/platfoms.enum';
import { PlacementDetail } from "@domain/placement/types/placement-detail.types";

export class PlacementId extends UniqueEntityID {}

export class Placement {
    private constructor(
      private readonly _id: PlacementId,
      private _organizationId: OrganizationId,
      private _platform: Platform,
      private _placementDetail: PlacementDetail,

      private readonly _createdAt: Date = new Date(),
      private _updatedAt: Date | null = null,
      private _deletedAt: Date | null = null
    ) {}

    static create(
      organizationId: OrganizationId,
      platform: Platform,
      placementDetail: PlacementDetail
    ): Placement {
        Placement.validatePlacementDetail(platform, placementDetail);

        return new Placement(new PlacementId(), organizationId, platform, placementDetail);
    }

    static fromPersistence(
      id: string,
      organizationId: string,
      platform: Platform,
      placementDetail: PlacementDetail
    ): Placement {
        Placement.validatePlacementDetail(platform, placementDetail);

        return new Placement(new PlacementId(id), new OrganizationId(organizationId), platform, placementDetail);
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
        return this._organizationId;
    }

    set organizationId(value: OrganizationId) {
        this._organizationId = value;
    }

    get platform(): Platform {
        return this._platform;
    }

    set platform(value: Platform) {
        this._platform = value;
    }

    get placementDetail(): PlacementDetail {
        return this._placementDetail;
    }

    set placementDetail(value: PlacementDetail) {
        Placement.validatePlacementDetail(this._platform, value);
        this._placementDetail = value;
    }

    private static validatePlacementDetail(platform: Platform, placementDetail: PlacementDetail) {
        if (platform === Platform.TWOGIS && !(placementDetail instanceof TwogisPlacementDetail)) {
            throw new Error('Invalid placement detail for TWOGIS placement-details');
        }
        if (platform === Platform.YANDEX && !(placementDetail instanceof YandexPlacementDetail)) {
            throw new Error('Invalid placement detail for YANDEX placement-details');
        }
    }

    private getPlacementDetail<T extends PlacementDetail>(expectedInstance: T): T {
        if (this._placementDetail instanceof expectedInstance.constructor) {
            return this._placementDetail as T;
        }
        throw new Error(`Invalid placement detail type for platform: ${this._platform}`);
    }

}
