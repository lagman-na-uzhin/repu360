import { Expose } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class PartnerIdDto {
  @Expose()
  @IsInt()
  @IsPositive()
  public authId: number;

  @Expose()
  @IsInt()
  @IsPositive()
  public partnerId: number;
}
