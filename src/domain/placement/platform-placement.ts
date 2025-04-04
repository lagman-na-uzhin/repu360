import { UniqueEntityID } from '@domain/common/unique-id';
import { OrganizationId } from '@domain/organization/organization';
import { YandexPlacementDetail } from '@domain/placement/model/yandex-placement-detail';
import { TwogisPlacementDetail } from '@domain/placement/model/twogis-placement-detail';
import { Platform } from '@domain/common/enums/platfoms.enum';

export class OrganizationPlacementId extends UniqueEntityID {}

type PlacementDetail = TwogisPlacementDetail | YandexPlacementDetail;

export class OrganizationPlacement {
    private constructor(
      private readonly _id: OrganizationPlacementId,
      private _organizationId: OrganizationId,
      private _platform: Platform,
      private _placementDetail: PlacementDetail
    ) {}

    static create(
      organizationId: OrganizationId,
      platform: Platform,
      placementDetail: PlacementDetail
    ): OrganizationPlacement {
        OrganizationPlacement.validatePlacementDetail(platform, placementDetail);

        return new OrganizationPlacement(new OrganizationPlacementId(), organizationId, platform, placementDetail);
    }

    static fromPersistence(
      id: string,
      organizationId: string,
      platform: Platform,
      placementDetail: PlacementDetail
    ): OrganizationPlacement {
        OrganizationPlacement.validatePlacementDetail(platform, placementDetail);

        return new OrganizationPlacement(new OrganizationPlacementId(id), new OrganizationId(organizationId), platform, placementDetail);
    }

    getYandexPlacementDetail(): YandexPlacementDetail {
        return this.getPlacementDetail(YandexPlacementDetail.prototype);
    }

    getTwogisPlacementDetail(): TwogisPlacementDetail {
        return this.getPlacementDetail(TwogisPlacementDetail.prototype);
    }


    get id(): OrganizationPlacementId {
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
        OrganizationPlacement.validatePlacementDetail(this._platform, value);
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
