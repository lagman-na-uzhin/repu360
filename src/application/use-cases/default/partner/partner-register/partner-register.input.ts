import {PartnerUserName} from "@domain/partner/value-object/partner-user-name.vo";
import {PartnerUserEmail} from "@domain/partner/value-object/partner-user-email.vo";
import {PartnerUserPhone} from "@domain/partner/value-object/partner-user-phone.vo";
import {PartnerTariff} from "@domain/partner/model/tariff/partner-tariff";

export class PartnerRegisterInput {
  constructor(
    public readonly name: PartnerUserName,
    public readonly email: PartnerUserEmail,
    public readonly phone: PartnerUserPhone,

    public readonly companyName: string,

    public readonly companyDataSync: boolean,
    public readonly multiAccess: boolean,
    public readonly registerPlacement: boolean,
    public readonly analysisByRadius: boolean,
    public readonly reviewAutoReply: boolean,
    public readonly analysisReview: boolean,
    public readonly reviewComplaint: boolean,
    public readonly analysisCompetitor: boolean
  ) {}
}
