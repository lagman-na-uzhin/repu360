import {GetListDto} from "@presentation/common/dto/get-list.dto";
import {Transform} from "class-transformer";
import {CompanyId} from "@domain/company/company";

export class GetListByCompanyDto extends GetListDto {
    @Transform(({ value }) => new CompanyId(value))
    public companyId: CompanyId;
}
