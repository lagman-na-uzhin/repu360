import {IsNotEmpty, IsString} from "class-validator";

export class GoogleSearchPlacesRequest {
    @IsNotEmpty({ message: 'text Id is required' })
    @IsString({ message: 'text must be a string' })
    readonly text: string;
}
