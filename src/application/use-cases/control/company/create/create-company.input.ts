import {BaseManagerInput} from "@application/use-cases/common/base-manager-input";
import {CompanyName} from "@domain/company/value-object/company-name.vo";
import {LeadId} from "@domain/manager/model/lead/lead";

export class CreateCompanyInput extends BaseManagerInput{
  constructor(
    public readonly leadId: LeadId,

    public readonly companyName: CompanyName,
  ) {super()}
}
