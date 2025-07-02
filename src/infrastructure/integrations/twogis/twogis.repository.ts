import { ITwogisRepository } from '@application/interfaces/integrations/twogis/repository/twogis-repository.interface';
import { GetOrganizationReviewsInDto } from '@application/interfaces/integrations/twogis/client/dto/in/get-organization-reviews.in.dto';
import {
  IOrganizationReviewsOutDto,
  ITwogisPreviewUrls,
  ITwogisReview,
} from '@application/interfaces/integrations/twogis/client/dto/out/organization-reviews.out.dto';
import { Review } from '@domain/review/review';
import { Profile, ProfileId } from '@domain/review/profile';
import {PlacementId} from '@domain/placement/placement';
import { PLATFORMS } from '@domain/placement/platfoms.enum';
import { TwogisReviewPlacementDetail } from '@domain/review/model/review/twogis-review-placement-detail';
import { TwogisProfilePlacementDetail } from '@domain/review/model/profile/twogis-profile-placement-detail';
import { ReviewMedia } from '@domain/review/model/review/review-media';
import {IProxy} from "@application/interfaces/repositories/proxy/proxy-repository.interface";
import {IGenerateReply} from "@application/interfaces/integrations/twogis/client/dto/out/generate-reply.out.dto";
import {RequestService} from "@infrastructure/services/request/request.service";
import {TwogisCabinetCredentials} from "@domain/placement/value-object/twogis/twogis-cabinet-credentials.vo";
import {Reply} from "@domain/review/model/review/reply/reply";
import {ReplyType} from "@domain/review/value-object/reply/reply-type.vo";
import {ProxyService} from "@infrastructure/services/request/proxy.service";
import {
  ACCOUNT_2GIS_AUTH,
  GENERATE_REVIEW_REPLY_CONFIG,
  GET_ORGANIZATION_REVIEWS_CONFIG, GET_ORGANIZATION_REVIEWS_NEXT_CONFIG, GET_REVIEW_CONFIG, SEND_REVIEW_REPLY_CONFIG
} from "@infrastructure/integrations/twogis/twogis.client.const";
import {
  IReviewFromCabinet
} from "@application/interfaces/integrations/twogis/client/dto/out/review-from-cabinet.out.dto";
import {ISendReply} from "@application/interfaces/integrations/twogis/client/dto/out/send-reply-response.out.dto";
import {
  ILoginTwogisCabinetResponse
} from "@application/interfaces/integrations/twogis/client/dto/out/login-cabinet.out.dto";

export class TwogisRepository implements ITwogisRepository {
  constructor(
      private readonly proxyService: ProxyService,
      private readonly requestService: RequestService,
  ) {}


  async getCabinetAccessToken(cabinetCredentials: TwogisCabinetCredentials, proxy: IProxy): Promise<ILoginTwogisCabinetResponse> {
    return this.requestService.request(
        ACCOUNT_2GIS_AUTH(cabinetCredentials.login, cabinetCredentials.password),
        proxy,
        5,
    );
  }

  async generateReply(accessToken: string, authorName: string, proxy: IProxy): Promise<IGenerateReply> {
    return this.requestService.request(
        GENERATE_REVIEW_REPLY_CONFIG(accessToken, authorName),
        proxy,
        1,
    );
  }


  async getOrganizationReviews(
      placementId: PlacementId,
      externalId: string,
      payload: GetOrganizationReviewsInDto,
      proxy: IProxy
  ): Promise<{ review: Review; profile: Profile }[] | null> {
    const reviews = await this.fetchAllOrganizationReviews(externalId, payload, proxy);
    if (!reviews) return null;

    return reviews.map((obj) => {
      const profile = this.createProfileModel(
          obj.user.id,
          obj.user.name,
          obj.user.photo_preview_urls,
      );
      const review = this.createReviewModel(obj, placementId, profile.id);
      return { review, profile };
    });
  }

  private async fetchAllOrganizationReviews(
      organizationExternalId: string,
      payload: GetOrganizationReviewsInDto,
      proxy: IProxy,
  ): Promise<IOrganizationReviewsOutDto['reviews'] | null> {
    const firstPage = await this.fetchReviews(organizationExternalId, payload, proxy, false);
    if (!firstPage) return null;

    const allReviews = [...firstPage.reviews];
    let nextReviewsUrl: string | undefined = firstPage.meta?.url;

    while (nextReviewsUrl) {
      await this.sleep(2000);

      const nextPage = await this.fetchReviews(nextReviewsUrl, payload, proxy, true);
      if (nextPage?.reviews?.length) {
        allReviews.push(...nextPage.reviews);
        nextReviewsUrl = nextPage.meta?.url;
      } else {
        break;
      }
    }

    return allReviews;
  }

  private async fetchReviews(
      source: string,
      payload: GetOrganizationReviewsInDto,
      proxy: IProxy,
      isNextPage: boolean,
  ): Promise<IOrganizationReviewsOutDto | null> {
    let retries = 7;

    do {
      const response: IOrganizationReviewsOutDto = isNextPage
          ? await this.requestService.request(GET_ORGANIZATION_REVIEWS_NEXT_CONFIG(source), proxy)
          : await this.requestService.request(
              GET_ORGANIZATION_REVIEWS_CONFIG(source, { type: payload.type, limit: 50 }),
              proxy,
          );

      if (response.reviews.length || response.meta?.branch_rating !== undefined) {
        return response;
      }

      await this.sleep(1000);
      retries--;
    } while (retries > 0);

    return null;
  }

  private createReviewModel(
    contract: ITwogisReview,
    placementId: PlacementId,
    profileId: ProfileId,
  ): Review {

    const officialAnswer = contract.official_answer
        ? Reply.create(
            contract.official_answer.id,
            contract.official_answer.text,
            ReplyType.EXTERNAL,
            true,
            profileId
        )
        : null;

    return Review.create(
        placementId,
        profileId,
        PLATFORMS.TWOGIS,
        contract.text,
        contract.rating,
        contract.photos.flatMap((i) =>
            Array.isArray(i.preview_urls)
                ? i.preview_urls.map((photo) =>
                    ReviewMedia.create(photo.url, new Date(i.date_created)),
                )
                : []
        ),
        TwogisReviewPlacementDetail.create(contract.id),
        officialAnswer ? [officialAnswer] : []
    );
  }

  private createProfileModel(
    id: string,
    name: string,
    twogisPreviewUrls: ITwogisPreviewUrls,
  ): Profile {
    return Profile.create(PLATFORMS.TWOGIS, name, name, twogisPreviewUrls.url, TwogisProfilePlacementDetail.create(id))
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getReviewFromCabinet(reviewExternalId: string, accessToken: string, proxy: IProxy): Promise<IReviewFromCabinet> {
    console.log(accessToken, "accessToken repo")
    console.log(reviewExternalId, "reviewExternalId repo")
    return this.requestService.request(
        GET_REVIEW_CONFIG(reviewExternalId, accessToken),
        proxy,
        1,
    );
  }

  async sendOfficialReply(accessToken: string, text: string, reviewExternalId: string, proxy: IProxy): Promise<ISendReply> {
    return this.requestService.request(
        SEND_REVIEW_REPLY_CONFIG(accessToken, text, reviewExternalId),
        proxy,
        1,
    );
  }
}
