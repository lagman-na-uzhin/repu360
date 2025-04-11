import { BaseManagerInput } from "@application/common/base-manager-input";
import { CompanyName } from "@domain/company/value-object/company-name.vo";
import { Manager } from "@domain/manager/manager";

export class CreateCompanyInput extends BaseManagerInput {
  private constructor(
      public readonly companyName: CompanyName,
      manager: Manager
  ) {
    super(manager);
  }

  public static of(name: string, manager: Manager) {
    return new CreateCompanyInput(new CompanyName(name), manager);
  }
}
