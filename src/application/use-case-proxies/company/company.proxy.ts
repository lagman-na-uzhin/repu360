import { ProxyPrefix } from '@application/use-case-proxies/proxy-prefix';

export const CompanyProxy = {
    "UPDATE_COMPANY_USE_CASE": `${ProxyPrefix.COMPANY_PROXY}UpdateCompanyUseCaseProxy`,
    "CREATE_COMPANY_USE_CASE": `${ProxyPrefix.COMPANY_PROXY}CreateCompanyUseCaseProxy`,
    "BY_ID_COMPANY_USE_CASE": `${ProxyPrefix.COMPANY_PROXY}ByIdCompanyUseCaseProxy`,
} as const;

export const companyProxyExports = [
    CompanyProxy.UPDATE_COMPANY_USE_CASE,
    CompanyProxy.CREATE_COMPANY_USE_CASE,
    CompanyProxy.BY_ID_COMPANY_USE_CASE,
]
