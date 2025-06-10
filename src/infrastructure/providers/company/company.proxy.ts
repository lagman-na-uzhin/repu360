import {ICompanyRepository} from "@domain/company/repositories/company-repository.interface";
import {CompanyOrmRepository} from "@infrastructure/repositories/company/company.repository";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {CompanyProxy} from "@application/use-case-proxies/company/company.proxy";
import {
  UpdateCompanyUseCase
} from "@application/use-cases/default/company/commands/update-company/update-company.usecase";
import {CreateCompanyUseCase} from "@application/use-cases/control/company/commands/create/create-company.usecase";


export const companyProxyProviders = [
  {
    inject: [CompanyOrmRepository],
    provide: CompanyProxy.UPDATE_COMPANY_USE_CASE,
    useFactory: (companyRepo: ICompanyRepository) => {
      return new UseCaseProxy(new UpdateCompanyUseCase(companyRepo))
    }
  },

  {
    inject: [CompanyOrmRepository],
    provide: CompanyProxy.CREATE_COMPANY_USE_CASE,
    useFactory: (companyRepo: ICompanyRepository) => {
      return new UseCaseProxy(new CreateCompanyUseCase(companyRepo))
    }
  },
]
