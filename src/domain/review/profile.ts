import { UniqueEntityID } from "@domain/common/unique-id";
import { Platform } from "@domain/placement/types/platfoms.enum";
import { TwogisProfilePlacementDetail } from "@domain/review/model/profile/twogis-profile-placement-detail";
import { YandexProfilePlacementDetail } from "@domain/review/model/profile/yandex-profile-placement-detail";

type ProfileDetail = TwogisProfilePlacementDetail | YandexProfilePlacementDetail;

export class ProfileId extends UniqueEntityID {}

export class Profile {
    private constructor(
      private readonly _id: ProfileId,
      private readonly _platform: Platform,
      private _firstname: string,
      private _surname: string,
      private _avatar: string | null,
      private _detail: ProfileDetail,

      private readonly _createdAt: Date = new Date(),
      private _updatedAt: Date | null = null,
      private _deletedAt: Date | null = null
    ) {}

    static create(
      platform: Platform,
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
      platform: Platform,
      firstname: string,
      surname: string,
      avatar: string | null,
      detail: ProfileDetail
    ): Profile {
        return new Profile(new ProfileId(id), platform, firstname, surname, avatar, detail);
    }

    update(surname: string, firstname: string, avatar: string | null): void {
        this.surname = surname;
        this.firstname = firstname;
        this.avatar = avatar;
    }

    getTwogisProfilePlacementDetail(): TwogisProfilePlacementDetail {
        if (this.platform === Platform.TWOGIS && this.detail instanceof TwogisProfilePlacementDetail) {
            return this.detail;
        }
        throw new Error("Invalid detail access: Expected TWOGIS profile detail");
    }

    getYandexProfilePlacementDetail(): YandexProfilePlacementDetail {
        if (this.platform === Platform.YANDEX && this.detail instanceof YandexProfilePlacementDetail) {
            return this.detail;
        }
        throw new Error("Invalid detail access: Expected YANDEX profile detail");
    }

    private static validateProfileDetail(platform: Platform, detail: ProfileDetail): void {
        if (platform === Platform.TWOGIS && !(detail instanceof TwogisProfilePlacementDetail)) {
            throw new Error("Invalid profile detail for TWOGIS placement-details");
        }
        if (platform === Platform.YANDEX && !(detail instanceof YandexProfilePlacementDetail)) {
            throw new Error("Invalid profile detail for YANDEX placement-details");
        }
    }

    get id(): ProfileId {
        return this._id;
    }

    get platform(): Platform {
        return this._platform;
    }

    get firstname(): string {
        return this._firstname;
    }

    set firstname(value: string) {
        if (!value.trim()) {
            throw new Error("Firstname cannot be empty");
        }
        this._firstname = value;
    }

    get surname(): string {
        return this._surname;
    }

    set surname(value: string) {
        if (!value.trim()) {
            throw new Error("Surname cannot be empty");
        }
        this._surname = value;
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
}

