import { UniqueID } from "@domain/common/unique-id";
import { PLATFORMS } from "@domain/common/platfoms.enum";
import { TwogisProfilePlacementDetail } from "@domain/review/model/profile/twogis-profile-placement-detail";
import { YandexProfilePlacementDetail } from "@domain/review/model/profile/yandex-profile-placement-detail";

type ProfileDetail = TwogisProfilePlacementDetail | YandexProfilePlacementDetail;

export class ProfileId extends UniqueID {}

export class Profile {
    private constructor(
      private readonly _id: ProfileId,
      private readonly _platform: PLATFORMS,
      private _first_name: string,
      private _last_name: string,
      private _avatar: string | null,
      private _detail: ProfileDetail,

      private readonly _createdAt: Date = new Date(),
      private _updatedAt: Date | null = null,
      private _deletedAt: Date | null = null
    ) {}

    static create(
      platform: PLATFORMS,
      firstname: string,
      surname: string,
      avatar: string | null,
      detail: ProfileDetail
    ): Profile {
        Profile.validateProfileDetail(platform, detail);
        return new Profile(new ProfileId(), platform, firstname, surname, avatar, detail);
    }

    static fromPersistence(
      id: string,
      platform: PLATFORMS,
      firstname: string,
      lastName: string,
      avatar: string | null,
      detail: ProfileDetail
    ): Profile {
        return new Profile(new ProfileId(id), platform, firstname, lastName, avatar, detail);
    }

    update(lastName: string, firstname: string, avatar: string | null): void {
        this.lastName = lastName;
        this.firstname = firstname;
        this.avatar = avatar;
    }

    getTwogisProfilePlacementDetail(): TwogisProfilePlacementDetail {
        if (this.platform === PLATFORMS.TWOGIS && this.detail instanceof TwogisProfilePlacementDetail) {
            return this.detail;
        }
        throw new Error("Invalid detail access: Expected TWOGIS profile detail");
    }

    getYandexProfilePlacementDetail(): YandexProfilePlacementDetail {
        if (this.platform === PLATFORMS.YANDEX && this.detail instanceof YandexProfilePlacementDetail) {
            return this.detail;
        }
        throw new Error("Invalid detail access: Expected YANDEX profile detail");
    }

    private static validateProfileDetail(platform: PLATFORMS, detail: ProfileDetail): void {
        if (platform === PLATFORMS.TWOGIS && !(detail instanceof TwogisProfilePlacementDetail)) {
            throw new Error("Invalid profile detail for TWOGIS placement-details");
        }
        if (platform === PLATFORMS.YANDEX && !(detail instanceof YandexProfilePlacementDetail)) {
            throw new Error("Invalid profile detail for YANDEX placement-details");
        }
    }

    get id(): ProfileId {
        return this._id;
    }

    get platform(): PLATFORMS {
        return this._platform;
    }

    get firstname(): string {
        return this._first_name;
    }

    set firstname(value: string) {
        if (!value.trim()) {
            throw new Error("Firstname cannot be empty");
        }
        this._first_name = value;
    }

    get lastName(): string {
        return this._last_name;
    }

    set lastName(value: string) {
        if (!value.trim()) {
            throw new Error("Surname cannot be empty");
        }
        this._last_name = value;
    }

    get avatar(): string | null {
        return this._avatar;
    }

    set avatar(value: string | null) {
        this._avatar = value;
    }

    get detail(): ProfileDetail {
        return this._detail;
    }

    set detail(value: ProfileDetail) {
        Profile.validateProfileDetail(this._platform, value);
        this._detail = value;
    }

    toPlainObject() {
        return {
            id: this._id.toString(),
            platform: this._platform,
            firstName: this._first_name,
            lastName: this._last_name,
            avatar: this._avatar,
            detail: this._detail,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
            deletedAt: this._deletedAt
        }
    }
}

