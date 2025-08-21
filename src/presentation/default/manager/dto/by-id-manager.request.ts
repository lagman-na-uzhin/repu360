import {Transform} from "class-transformer";
import {ManagerId} from "@domain/manager/manager";

export class ByIdManagerRequestParamsDto {
    @Transform(({ value }) => ManagerId.of(value))
    readonly managerId: ManagerId;
}
