import { ProxyPrefix } from '@application/use-case-proxies/proxy-prefix';

export const OrganizationProxy = {
    "GET_LIST": `${ProxyPrefix.ORGANIZATION_PROXY}GetOrganizationListUseCaseProxy`,
    "ADD": `${ProxyPrefix.ORGANIZATION_PROXY}AddOrganizationUseCaseProxy`,
    "COMPACT_ORGANIZATIONS": `${ProxyPrefix.ORGANIZATION_PROXY}GetCompactOrganizationsUseCaseProxy`,
    "GET_SUMMARY": `${ProxyPrefix.ORGANIZATION_PROXY}GetSummaryUseCaseProxy`,
} as const;

export const organizationProxyExports = [
    OrganizationProxy.GET_LIST,
    OrganizationProxy.ADD,
    OrganizationProxy.COMPACT_ORGANIZATIONS,
    OrganizationProxy.GET_SUMMARY
]
