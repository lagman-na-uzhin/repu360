import { Expose, plainToInstance } from 'class-transformer';
import {Company} from "@domain/company/company";

export class CompanyResponseDto {
    @Expose()
    id: string;

    @Expose()
    managerId: string;

    @Expose()
    name: string;

    public static fromDomain(company: Company): CompanyResponseDto {
        const plainObject = company.toPlainObject();
        return plainToInstance(CompanyResponseDto, plainObject, {
            excludeExtraneousValues: true,
        });
    }
}
