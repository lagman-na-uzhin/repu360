import {ICompanyRepository} from "@domain/company/repositories/company-repository.interface";
import {CreateCompanyUseCase} from "@application/use-cases/control/company/commands/create/create-company.usecase";
import {CompanyOrmRepository} from "@infrastructure/repositories/company/company.repository";
import {PREFIX} from "@infrastructure/usecase-proxy/prefix";
import {UseCaseProxy} from "@infrastructure/usecase-proxy/usecase-proxy";
import {ByIdCompanyControlUseCase} from "@application/use-cases/control/company/queries/get-by-id/by-id-company.usecase";
import {GetListCompanyUseCase} from "@application/use-cases/control/company/queries/get-list/get-list-company.usecase";

export enum CompanyProxy {
  CREATE_COMPANY_USE_CASE = `${PREFIX.COMPANY_PROXY}CreateCompanyControlUseCaseProxy`,
  BY_ID_COMPANY_USE_CASE = `${PREFIX.COMPANY_PROXY}GetByIdUseCaseProxy`,
  GET_LIST_COMPANY_USE_CASE = `${PREFIX.COMPANY_PROXY}GetListCompanyUseCaseProxy`

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
