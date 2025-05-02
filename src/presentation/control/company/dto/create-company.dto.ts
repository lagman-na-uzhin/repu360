import {Allow} from "class-validator";
import {Actor} from "@domain/policy/actor";
import {ActorDto} from "@presentation/common/dto/actor-body.dto";

export class CreateCompanyDto {
  public name: string;

  public companyName: string;

  public phone: string;

  public email: string;
}
