import {Inject, Injectable} from "@nestjs/common";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {Interval} from "@nestjs/schedule";
import {
    SyncOrganizationScheduleUseCase
} from "@application/use-cases/background/organization/sync-organization/sync-organization-sh.usecase";
import {OrganizationProxy} from "@application/use-case-proxies/organization/organization.proxy";

@Injectable()
export class SyncOrganizationSchedule {
    constructor(
        @Inject(OrganizationProxy.SYNC_SCHEDULE)
        private readonly syncOrganizationSchedule: UseCaseProxy<SyncOrganizationScheduleUseCase>,
    ) {}

    @Interval(10000)
    async sync() {
        return this.syncOrganizationSchedule.getInstance().execute();
    }

    // @Interval(10_000)
    // async syncYandexReviews() {
    // }
}
