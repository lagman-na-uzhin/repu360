import {EmployeeEmail} from "@domain/company/value-object/employee-email.vo";
import {EmployeePhone} from "@domain/company/value-object/employee-user-phone.vo";
import {EmployeeName} from "@domain/company/value-object/employee-user-name.vo";
import {BaseManagerInput} from "@application/use-cases/common/base-manager-input";
import {CompanyName} from "@domain/company/value-object/company-name.vo";

export class CompanyRegisterInput extends BaseManagerInput{
  constructor(
    //   COMPANY OWNER
    public readonly name: EmployeeName,
    public readonly email: EmployeeEmail,
    public readonly phone: EmployeePhone,

    // COMPANY
    public readonly companyName: CompanyName,

    //TARIFF
    public readonly isActive: boolean,
    public readonly price: number,
    public readonly companyDataSync: boolean,
    public readonly reviewSync: boolean,
    public readonly multiAccess: boolean,
    public readonly registerPlacement: boolean,
    public readonly reviewReply: boolean,
    public readonly analysisByRadius: boolean,
    public readonly reviewAutoReply: boolean,
    public readonly analysisReview: boolean,
    public readonly reviewComplaint: boolean,
    public readonly reviewAutoComplaint: boolean,
    public readonly analysisCompetitor: boolean
  ) {super()}
}
