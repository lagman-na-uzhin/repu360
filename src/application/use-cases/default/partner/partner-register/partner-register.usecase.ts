import {Partner} from '@domain/partner/partner';
import {EXCEPTION} from '@domain/common/exceptions/exceptions.const';
import {IPartnerUserRepository} from "@domain/partner/repositories/partner-user-repository.interface";
import {PartnerUser} from "@domain/partner/model/partner-user/partner-user";
import {IPartnerRepository} from "@domain/partner/repositories/partner-repository.interface";
import {PartnerUserName} from '@domain/partner/value-object/partner-user-name.vo';
import {PartnerUserEmail} from '@domain/partner/value-object/partner-user-email.vo';
import {PartnerUserPhone} from '@domain/partner/value-object/partner-user-phone.vo';
import {PartnerUserPassword} from '@domain/partner/value-object/partner-user-password.vo';
import {IHashService} from '@application/services/hash/hash-service.interface';
import {PartnerRegisterInput} from '@application/use-cases/default/partner/partner-register/partner-register.input';
import {USER_TYPE, PartnerUserRole} from "@domain/partner/model/partner-user/partner-user-role";
import {ManagerPermission} from "@domain/manager/value-object/manager-permission";
import {PartnerTariffFeatures} from "@domain/partner/model/tariff/partner-tariff-feature";

export class RegisterPartnerUseCase {
  constructor(
    private readonly userRepo: IPartnerUserRepository,
    private readonly partnerRepo: IPartnerRepository,
    private readonly hashService: IHashService
  ) {}

  async execute(inpur: PartnerRegisterInput): Promise<Partner> { //TODO
    const user: PartnerUser = await this.createUser(inpur.name, inpur.email, inpur.phone);

    const partner: Partner = this.createPartner(dto.companyName, user);

    await this.partnerRepo.save(partner);

    return partner;
  }

  private async createUser(name: PartnerUserName, email: PartnerUserEmail, phone: PartnerUserPhone): Promise<PartnerUser> {
    await this.userCredentialsIsExist(email, phone);

    const password = await this.generatePassword();
    const avatar = this.generateAvatar();

    const role = this.createPartnerOwnerRole()

    return PartnerUser.create(
      PartnerUserRole.PARTNER,
      new PartnerUserName(name),
      new PartnerUserEmail(email),
      new PartnerUserPhone(phone),
      new PartnerUserPassword(password),
      avatar
    );
  }

  private createPartnerOwnerRole(фсешмуFeatures: any) {
    const permissions = ManagerPermission.create()
    return PartnerUserRole.create(USER_TYPE.PARTNER_OWNER, permissions)
  }


  private createPartner(companyName: string, owner: PartnerUser): Partner {
    return Partner.create(
        companyName,
        null,
        [owner]
    )
  }

  private async userCredentialsIsExist(email: PartnerUserEmail, phone: PartnerUserPhone) {
    const emailIsExist = await this.userRepo.emailIsExist(email.toString())
    if (emailIsExist) throw new Error(EXCEPTION.USER.EMAIL_ALREADY_EXIST)

    const phoneIsExist = await this.userRepo.phoneIsExist(phone.toString())
    if (phoneIsExist) throw new Error(EXCEPTION.USER.PHONE_ALREADY_EXIST);
  }

  private generatePassword() {
    const generated = `${Math.floor(Math.random() * (99999999 - 10000000) + 10000000)}`;
    return this.hashService.hash(generated)
  }

  private generateAvatar(): string {
    const randomNumber = Math.floor(Math.random() * 39) + 1;
    return `default-avatars/${randomNumber}.svg`;
  }
}
