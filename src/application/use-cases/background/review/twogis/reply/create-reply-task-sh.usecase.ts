
import { SECOND } from 'time-constants';
import {IReviewRepository} from "@domain/review/repositories/review-repository.interface";
import {ITaskService, QUEUES} from "@application/interfaces/services/task/task-service.interface";
import {ICacheRepository} from "@application/interfaces/services/cache/cache-repository.interface";
import {Review} from "@domain/review/review";
import {TwogisSendReplyCommand} from "@application/use-cases/background/review/twogis/reply/send-reply.command";
import {IPlacementRepository} from "@domain/placement/repositories/placement-repository.interface";
import {Placement, PlacementId} from "@domain/placement/placement";
import {CompanyId} from "@domain/company/company";
import {ICompanyRepository} from "@domain/company/repositories/company-repository.interface";
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";

export class TwogisCreateSendReplyTaskScheduleUseCase {
    private readonly timeMap = new Map<PlacementId, number>();

    constructor(
        private readonly reviewRepo: IReviewRepository,
        private readonly placementRepo: IPlacementRepository,
        private readonly taskService: ITaskService,
        private readonly cacheRepo: ICacheRepository,
        private readonly companyRepo: ICompanyRepository
    ) {}

    async execute() {
        const placements = await this.placementRepo.getActiveTwogisListOfAutoReply();
        console.log(placements, "placements TwogisCreateSendReplyTaskScheduleUseCase")
        if (!placements.length) return;

        const now = Date.now();
        for (let placement of placements) {
            const lastRequestTime = this.timeMap.get(placement.id) || 0;
            if (now - lastRequestTime >= 2 * SECOND) {
                this.timeMap.set(placement.id, now);
                this.initTask(placement);
            }
        }
    }

    private async initTask(placement: Placement) {
        console.log("init task")
        const hasCooldown = await this.cacheRepo.hasTwogisReplyCooldown(placement.id);
        console.log(hasCooldown, 'has cooldown')
        if (hasCooldown) return;

        const review = await this.reviewRepo.getTwogisReviewForReply(placement.id);
        console.log(review, 'has review')
        if (!review || review.hasOfficialReply()) return;

        await this.sendTask(placement, review);
        console.log(`SENT TASK FOR SENDING REPLY ${placement.id}_${review.id}`);
    }

    private async sendTask(
        placement: Placement,
        review: Review,
    ) {
        const jobId = `${placement.id}_${review.id}`;
        const isJobExists = await this.taskService.isJobExists(
            jobId,
            QUEUES.SEND_REPLY_QUEUE,
        );

        if (!isJobExists) {
            const command = TwogisSendReplyCommand.of(placement.id.toString(), review.id.toString(), 'new CompanyId()'); //TODO mock

            await this.taskService.addTask({
                queue: QUEUES.SEND_REPLY_QUEUE,
                jobId,
                attempts: 1,
                delay: 0,
                payload: command,
            });
        }
    }
}
