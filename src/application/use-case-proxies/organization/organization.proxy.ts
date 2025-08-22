import { ProxyPrefix } from '@application/use-case-proxies/proxy-prefix';

export const OrganizationProxy = {
    "GET_LIST": `${ProxyPrefix.ORGANIZATION_PROXY}GetOrganizationListUseCaseProxy`,
    "ADD": `${ProxyPrefix.ORGANIZATION_PROXY}AddOrganizationUseCaseProxy`,
    "COMPACT_ORGANIZATIONS": `${ProxyPrefix.ORGANIZATION_PROXY}GetCompactOrganizationsUseCaseProxy`,
    "GET_SUMMARY": `${ProxyPrefix.ORGANIZATION_PROXY}GetSummaryUseCaseProxy`,
    "SYNC_SCHEDULE": `${ProxyPrefix.ORGANIZATION_PROXY}SyncOrganizationScheduleUseCaseProxy`,
    "SYNC_TWOGIS_PROCESS": `${ProxyPrefix.ORGANIZATION_PROXY}SyncTwogisOrganizationProcessUseCaseProxy`,
    // "SYNC_GOOGLE_PROCESS": `${ProxyPrefix.ORGANIZATION_PROXY}SyncGoogleOrganizationProcessUseCaseProxy`,
} as const;

export const organizationProxyExports = [
    OrganizationProxy.GET_LIST,
    OrganizationProxy.ADD,
    OrganizationProxy.COMPACT_ORGANIZATIONS,
    OrganizationProxy.GET_SUMMARY,
    OrganizationProxy.SYNC_SCHEDULE
]
