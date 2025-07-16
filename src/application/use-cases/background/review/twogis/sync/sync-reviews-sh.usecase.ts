import { MINUTE } from 'time-constants';
import {ITaskService, QUEUES} from "@application/interfaces/services/task/task-service.interface";
import {IPlacementRepository} from "@domain/placement/repositories/placement-repository.interface";
import {PlacementId} from "@domain/placement/placement";


export class SyncTwogisReviewsScheduleUseCase {
  constructor(
    private readonly placementRepo: IPlacementRepository,
    private readonly taskService: ITaskService,
  ) {}

  private readonly timeMap = new Map<PlacementId, number>();

  async execute() {
    const twogisPlacements =
      await this.placementRepo.getActiveTwogisPlacements();

    console.log(twogisPlacements, "twogisPlacements")
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

  private async initTask(placementId: PlacementId):Promise<void>  {

    await this.taskService.addTask({
      queue: QUEUES.SYNC_TWOGIS_REVIEWS,
      jobId: `sync_twogis_reviews_${placementId}`,
      attempts: 1,
      delay: 0,
      payload: {placementId: placementId.toString()},
    });
  }
}
