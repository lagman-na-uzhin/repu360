import { PREFIX } from 'src/infrastructure/usecase-proxy/prefix';
import { UseCaseProxy } from 'src/infrastructure/usecase-proxy/usecase-proxy';
import { OrganizationOrmRepository } from 'src/infrastructure/repositories/organization/organization.repository';
import { UserOrmRepository } from 'src/infrastructure/repositories/user/user.repository';
import {
  RegisterPartnerUseCase
} from "@application/use-cases/control/company/company-register/company-register.usecase";
import {IPartnerUserRepository} from "@domain/company/repositories/employee-repository.interface";
import {IPartnerRepository} from "@domain/company/repositories/company-repository.interface";
import { PartnerOrmRepository } from '@infrastructure/repositories/partner/partner.repository';
import { BcryptService } from '@infrastructure/services/hash/bcrypt.service';
import { IHashService } from '@application/services/hash/hash-service.interface';

export enum PartnerProxy {
  REGISTER_PARTNER_USE_CASE = `${PREFIX.PARTNER_PROXY}RegisterPartnerUseCaseProxy`
}

export const partnerProxyProviders = [
  {
    inject: [UserOrmRepository, PartnerOrmRepository, BcryptService],
    provide: PartnerProxy.REGISTER_PARTNER_USE_CASE,
    useFactory: (userRepo: IPartnerUserRepository, partnerRepo: IPartnerRepository, hashService: IHashService) => {
      return new UseCaseProxy(new RegisterPartnerUseCase(userRepo, partnerRepo, hashService))
    }
  }
]
export const partnerProxyExports = [
  PartnerProxy.REGISTER_PARTNER_USE_CASE,
]
