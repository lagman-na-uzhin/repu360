import {Inject, Injectable} from "@nestjs/common";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {Interval} from "@nestjs/schedule";
import {OrganizationProxy} from "@application/use-case-proxies/organization/organization.proxy";
import {
    SyncTwogisOrganizationScheduleUseCase
} from "@application/use-cases/background/organization/sync-organization/sync-organization-sh.usecase";

@Injectable()
export class SyncOrganizationSchedule {
    constructor(
        @Inject(OrganizationProxy.SYNC_TWOGIS_SCHEDULE)
        private readonly syncOrganizationSchedule: UseCaseProxy<SyncTwogisOrganizationScheduleUseCase>,
    ) {}

    @Interval(50000)
    async sync() {
        return this.syncOrganizationSchedule.getInstance().execute();
    }
}
