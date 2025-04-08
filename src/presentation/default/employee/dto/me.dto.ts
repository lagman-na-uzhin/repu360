import { IsString } from 'class-validator';
import {Expose} from "class-transformer";

export class UserMeDto {
    @Expose()
    @IsString()
    authId: string;
}
