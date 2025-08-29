import {ITaskService, QUEUES} from "@application/interfaces/services/task/task-service.interface";
import {IPlacementRepository} from "@domain/placement/repositories/placement-repository.interface";
import {PlacementId} from "@domain/placement/placement";
import {IOrganizationRepository} from "@domain/organization/repositories/organization-repository.interface";
import {OrganizationId} from "@domain/organization/organization";


export class SyncTwogisOrganizationScheduleUseCase {
    constructor(
        private readonly organizationRepo: IOrganizationRepository,
        private readonly placementRepo: IPlacementRepository,
        private readonly taskService: ITaskService,
    ) {}

    private readonly timeMap = new Map<PlacementId, number>();

    async execute() {
        const activeOrganizations = await this.organizationRepo.getActiveList();

        const now = Date.now();
        for (let i = 0; i < activeOrganizations.length; i++) {
            const organizationId = activeOrganizations[i].id;
            const lastRequestTime = this.timeMap.get(organizationId) || 0;

            if (now - lastRequestTime >= 30 * 18000) {
                this.timeMap.set(organizationId, now);

                await this.initTask(organizationId)
            }
        }
    }

    private async initTask(organizationId: OrganizationId):Promise<void>  {
        await this.taskService.addTask({
            queue: QUEUES.SYNC_TWOGIS_ORGANIZATION,
            jobId: `sync_organization_${organizationId.toString()}`,
            attempts: 1,
            delay: 0,
            payload: {organizationId: organizationId.toString()},
        });
    }
}
