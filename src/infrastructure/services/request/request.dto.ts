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
} from "src/application/services/request/request.dto";
import {REQUEST_METHOD, RESPONSE_TYPE} from "src/application/services/request/request.enum";

class RequestConfigHeaders implements IRequestConfigHeaders {
  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public Accept?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public 'Content-Type'?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public 'User-Agent'?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public 'X-Auth-Token'?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public 'Accept-Language'?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public 'Ya-Client-Host'?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public 'Ya-Client-Cookie'?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public 'X-Requested-With'?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public Host?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public Referer?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public Origin?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public Cookie?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
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

export class RequestDto implements IRequestDto{
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
