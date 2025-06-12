import { ProxyPrefix } from '@application/use-case-proxies/proxy-prefix';

export enum SubscriptionProxy {
    CREATE_SUBSCRIPTION_USE_CASE = `${ProxyPrefix.REVIEW_PROXY}CreateSubscriptionUseCaseProxy`,

}
export const subscriptionProxyExports = [
    SubscriptionProxy.CREATE_SUBSCRIPTION_USE_CASE,
]
