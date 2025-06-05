import {ICompanyRepository} from "@domain/company/repositories/company-repository.interface";
import {CreateCompanyUseCase} from "@application/use-cases/control/company/commands/create/create-company.usecase";
import {CompanyOrmRepository} from "@infrastructure/repositories/company/company.repository";
import {ProxyPrefix} from "@application/use-case-proxies/proxy-prefix";
import {ByIdCompanyControlUseCase} from "@application/use-cases/control/company/queries/get-by-id/by-id-company.usecase";
import {GetListCompanyUseCase} from "@application/use-cases/control/company/queries/get-list/get-list-company.usecase";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";

export enum CompanyProxy {
  CREATE_COMPANY_USE_CASE = `${ProxyPrefix.COMPANY_PROXY}CreateCompanyControlUseCaseProxy`,
  BY_ID_COMPANY_USE_CASE = `${ProxyPrefix.COMPANY_PROXY}GetByIdUseCaseProxy`,
  GET_LIST_COMPANY_USE_CASE = `${ProxyPrefix.COMPANY_PROXY}GetListCompanyUseCaseProxy`

}

export const companyProxyProviders = [
  {
    inject: [CompanyOrmRepository],
    provide: CompanyProxy.CREATE_COMPANY_USE_CASE,
    useFactory: (companyRepo: ICompanyRepository) => {
      return new UseCaseProxy(new CreateCompanyUseCase(companyRepo))
    }
  },

  {
    inject: [CompanyOrmRepository],
    provide: CompanyProxy.BY_ID_COMPANY_USE_CASE,
    useFactory: (companyRepo: ICompanyRepository) => {
      return new UseCaseProxy(new ByIdCompanyControlUseCase(companyRepo))
    }
  },

  {
    inject: [CompanyOrmRepository],
    provide: CompanyProxy.GET_LIST_COMPANY_USE_CASE,
    useFactory: (companyRepo: ICompanyRepository) => {
      return new UseCaseProxy(new GetListCompanyUseCase(companyRepo))
    }
  }
]
export const companyProxyExports = [
    CompanyProxy.CREATE_COMPANY_USE_CASE,
    CompanyProxy.BY_ID_COMPANY_USE_CASE,
    CompanyProxy.GET_LIST_COMPANY_USE_CASE,
]
