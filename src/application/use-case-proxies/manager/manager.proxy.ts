import { ProxyPrefix } from '@application/use-case-proxies/proxy-prefix';

export const ManagerProxy = {
    "BY_ID": `${ProxyPrefix.MANAGER_PROXY}ByIdManagerUseCaseProxy`,
} as const;

export const managerProxyExports = [
    ManagerProxy.BY_ID,
]
