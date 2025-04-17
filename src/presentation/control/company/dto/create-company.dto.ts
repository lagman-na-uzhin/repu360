import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import {ActorDto} from "@presentation/common/dto/actor-body.dto";
import {CreateCompanyCommand} from "@application/use-cases/control/company/create/create-company.command";

export class CreateCompanyDto extends ActorDto {
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
