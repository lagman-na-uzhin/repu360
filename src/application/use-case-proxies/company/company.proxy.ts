import { ProxyPrefix } from '@application/use-case-proxies/proxy-prefix';
import {GetListCompanyUseCase} from "@application/use-cases/control/company/queries/get-list/get-list-company.usecase";

export const CompanyProxy = {
    "UPDATE_COMPANY_USE_CASE": `${ProxyPrefix.COMPANY_PROXY}UpdateCompanyUseCaseProxy`,
    "CREATE_COMPANY_USE_CASE": `${ProxyPrefix.COMPANY_PROXY}CreateCompanyUseCaseProxy`,
    "BY_ID_COMPANY_USE_CASE": `${ProxyPrefix.COMPANY_PROXY}ByIdCompanyUseCaseProxy`,
    "GET_LIST_COMPANY_USE_CASE": `${ProxyPrefix.COMPANY_PROXY}GetListCompanyUseCaseProxy`,
} as const;

export const companyProxyExports = [
    CompanyProxy.UPDATE_COMPANY_USE_CASE,
    CompanyProxy.CREATE_COMPANY_USE_CASE,
    CompanyProxy.BY_ID_COMPANY_USE_CASE,
    CompanyProxy.GET_LIST_COMPANY_USE_CASE
]
