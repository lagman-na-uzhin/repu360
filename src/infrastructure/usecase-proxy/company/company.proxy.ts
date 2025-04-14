import {ICompanyRepository} from "@domain/company/repositories/company-repository.interface";
import {CreateCompanyUseCase} from "@application/use-cases/control/company/create/create-company.usecase";
import {CompanyOrmRepository} from "@infrastructure/repositories/company/company.repository";
import {PREFIX} from "@infrastructure/usecase-proxy/prefix";
import {UseCaseProxy} from "@infrastructure/usecase-proxy/usecase-proxy";
import {ByIdCompanyControlUseCase} from "@application/use-cases/control/company/get-by-id/by-id-company.usecase";

export enum CompanyProxy {
  CREATE_COMPANY_USE_CASE = `${PREFIX.PARTNER_PROXY}RegisterPartnerUseCaseProxy`,
  BT_ID_COMPANY_USE_CASE = `${PREFIX.PARTNER_PROXY}RegisterPartnerUseCaseProxy`,
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
    provide: CompanyProxy.BT_ID_COMPANY_USE_CASE,
    useFactory: (companyRepo: ICompanyRepository) => {
      return new UseCaseProxy(new ByIdCompanyControlUseCase(companyRepo))
    }
  }
]
export const companyProxyExports = [
    CompanyProxy.CREATE_COMPANY_USE_CASE,
    CompanyProxy.BT_ID_COMPANY_USE_CASE
]
