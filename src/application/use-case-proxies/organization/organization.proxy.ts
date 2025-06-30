import { ProxyPrefix } from '@application/use-case-proxies/proxy-prefix';

export const OrganizationProxy = {
    "GET_USER_PERMITTED_ORGANIZATIONS_LIST": `${ProxyPrefix.REVIEW_PROXY}GetUserPermittedOrganizationListUseCaseProxy`,
    "GET_LIST": `${ProxyPrefix.USER_PROXY}GetOrganizationListUseCaseProxy`,
    "ADD": `${ProxyPrefix.USER_PROXY}AddOrganizationUseCaseProxy`,
} as const;

export const organizationProxyExports = [
    OrganizationProxy.GET_USER_PERMITTED_ORGANIZATIONS_LIST,
    OrganizationProxy.GET_LIST,
    OrganizationProxy.ADD
]
