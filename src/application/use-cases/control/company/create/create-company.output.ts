import {CompanyId} from "@domain/company/company";

export class CreateCompanyOutput {
    private constructor(
        public readonly companyId: string,
    ) {}

    public static of(companyId: CompanyId) {
        return new CreateCompanyOutput(companyId.toString());
    }
}
