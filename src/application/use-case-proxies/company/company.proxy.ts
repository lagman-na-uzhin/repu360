import { ProxyPrefix } from '@application/use-case-proxies/proxy-prefix';

export enum CompanyProxy {
    UPDATE_COMPANY_USE_CASE = `${ProxyPrefix.COMPANY_PROXY}UpdateCompanyUseCaseProxy`,
    CREATE_COMPANY_USE_CASE = `${ProxyPrefix.COMPANY_PROXY}CreateCompanyUseCaseProxy`

}
export const companyProxyExports = [
    CompanyProxy.UPDATE_COMPANY_USE_CASE,
    CompanyProxy.CREATE_COMPANY_USE_CASE
]
