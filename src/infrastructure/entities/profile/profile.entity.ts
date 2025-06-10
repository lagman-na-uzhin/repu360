import {Column, Entity, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';
import { ReviewEntity } from '@infrastructure/entities/review/review.entity';
import {
  TwogisProfilePlacementDetailEntity,
} from '@infrastructure/entities/profile/placement-details/twogis-profile.entity';
import { YandexProfilePlacementDetailEntity } from "@infrastructure/entities/profile/placement-details/yandex-profile.entity";
import {Platform} from "@domain/placement/types/platfoms.enum";

@Entity('profile')
export class ProfileEntity {
  @PrimaryColumn('uuid')
  public id: string;

  @Column({ nullable: true })
  public firstname: string;

  @Column({ nullable: true })
  public surname: string;

  @Column({ nullable: true, type: "text" })
  public avatar: string | null;

  @Column({ type: 'enum', enum: Platform })
  public placement: Platform

  @OneToMany(() => ReviewEntity, (review) => review.profile, {cascade: ['soft-remove']})
  reviews: ReviewEntity[];

  @OneToOne(() => TwogisProfilePlacementDetailEntity, twogisDetail => twogisDetail.profile,
      {
        cascade: ['insert', 'update', 'soft-remove'],
        eager: true
      })
  twogisDetail?: TwogisProfilePlacementDetailEntity | null;

  @OneToOne(() => YandexProfilePlacementDetailEntity, yandexDetail => yandexDetail.profile,
      {
        cascade: ['insert', 'update', 'soft-remove'],
        eager: true
      })
  yandexDetail?: YandexProfilePlacementDetailEntity | null;
}
