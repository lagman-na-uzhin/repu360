import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  IRequestConfigDto,
  IRequestConfigHeaders,
  IRequestConfigLocalDto, IRequestDto
} from "@application/interfaces/services/request/request.dto";
import {REQUEST_METHOD, RESPONSE_TYPE} from "@application/interfaces/services/request/request.enum";

class RequestConfigHeaders implements IRequestConfigHeaders {
  @Expose()
  @IsOptional()
  @IsString()
  public Accept?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public 'Content-Type'?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public 'User-Agent'?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public 'X-Auth-Token'?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public 'Accept-Language'?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public 'Ya-Client-Host'?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public 'Ya-Client-Cookie'?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public 'X-Requested-With'?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public Host?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public Referer?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public Origin?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public Cookie?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public Authorization?: string;
}

class RequestConfigDto implements IRequestConfigDto{
  @Expose()
  @IsEnum(REQUEST_METHOD)
  public method: REQUEST_METHOD;

  @Expose()
  @IsString()
  @IsNotEmpty()
  public url: string;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  public data?: any;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  public params?: any;

  @Expose()
  @IsObject()
  @ValidateNested()
  @Type(() => RequestConfigHeaders)
  public headers: RequestConfigHeaders;

  @Expose()
  @IsNumber()
  @IsOptional()
  public readonly timeout?: number;

  @Expose()
  @IsOptional()
  @IsBoolean()
  public readonly withCredentials?: boolean;

  @Expose()
  @IsOptional()
  @IsNumber()
  public readonly maxRedirects?: number;

  @Expose()
  @IsOptional()
  @IsBoolean()
  public strictSSL?: boolean;
}

class RequestConfigLocalDto implements IRequestConfigLocalDto{
  @Expose()
  @IsOptional()
  @IsEnum(RESPONSE_TYPE)
  public responseType?: RESPONSE_TYPE;
}

export class RequestDto implements IRequestDto {
  @Expose()
  @IsObject()
  @ValidateNested()
  @Type(() => RequestConfigDto)
  public requestConfig: RequestConfigDto;

  @Expose()
  @IsObject()
  @ValidateNested()
  @Type(() => RequestConfigLocalDto)
  public localConfig: RequestConfigLocalDto;

  @Expose()
  @IsOptional()
  public isFile?: boolean;
}
