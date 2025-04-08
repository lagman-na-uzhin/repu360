import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class RegisterPartnerDto {
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

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  public inviteId: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  public agentId: number;
}
