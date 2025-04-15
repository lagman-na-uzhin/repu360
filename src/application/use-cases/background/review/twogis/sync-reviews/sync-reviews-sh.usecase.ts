import { MINUTE } from 'time-constants';
import {IProxyService} from "@application/interfaces/services/proxy/proxy-service.interface";
import {ITaskService, QUEUES} from "@application/interfaces/services/task/task-service.interface";
import {
  IOrganizationRepository
} from "@domain/organization/repositories/organization-repository.interface";
import {UniqueID} from "@domain/common/unique-id";
import { SyncTwogisReviewsProcessDto } from '@presentation/background/platform/twogis/dto/sync-twogis-reviews.dto';
import {IPlacementRepository} from "@domain/placement/repositories/placement-repository.interface";

export class SyncTwogisReviewsScheduleUseCase {
  constructor(
    private readonly placementRepo: IPlacementRepository,
    private readonly taskService: ITaskService,
  ) {}

  private readonly timeMap = new Map<UniqueID, number>();

  async execute() {
    const twogisPlacements =
      await this.placementRepo.getActiveTwogisPlacements();

    const now = Date.now();
    for (let i = 0; i < twogisPlacements.length; i++) {
      const twogisPlacementId = twogisPlacements[i].id;
      const lastRequestTime = this.timeMap.get(twogisPlacementId) || 0;

      if (now - lastRequestTime >= 30 * MINUTE) {
        this.timeMap.set(twogisPlacementId, now);

        await this.initTask(twogisPlacementId)
      }
    }
  }

  private async initTask(organizationPlatformId: UniqueID):Promise<void>  {
    const payload: SyncTwogisReviewsProcessDto = {organizationPlatformId};
    await this.taskService.addTask({
      queue: QUEUES.SYNC_TWOGIS_REVIEWS,
      jobId: `sync_twogis_reviews_${organizationPlatformId}`,
      attempts: 1,
      delay: 0,
      payload,
    });
  }
}
