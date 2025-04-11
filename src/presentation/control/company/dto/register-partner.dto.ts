import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import {ManagerDto} from "@presentation/common/dto/manager-body.dto";

export class CreateCompanyDto extends ManagerDto {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  public companyName: string;

  @IsNotEmpty()
  @IsString()
  @Length(10)
  public phone: string;

  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  public email: string;
}
