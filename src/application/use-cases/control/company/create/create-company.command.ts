import { CompanyName } from "@domain/company/value-object/company-name.vo";
import {BaseCommand} from "@application/common/base-command/base-command";
import {Actor} from "@domain/policy/actor";

export class CreateCompanyCommand extends BaseCommand {
  private constructor(
      public readonly companyName: CompanyName,
      actor: Actor
  ) {
    super(actor);
  }

  public static of(name: string, actor: Actor) {
    return new CreateCompanyCommand(new CompanyName(name), actor);
  }
}
