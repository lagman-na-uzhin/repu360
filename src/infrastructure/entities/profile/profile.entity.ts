import {Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import { ReviewEntity } from '@infrastructure/entities/review/review.entity';
import {
  TwogisProfilePlacementDetailEntity,
} from '@infrastructure/entities/profile/placement-details/twogis-profile.entity';
import { YandexProfilePlacementDetailEntity } from "@infrastructure/entities/profile/placement-details/yandex-profile.entity";
import {Platform} from "@domain/common/enums/platfoms.enum";

@Entity('profile')
export class ProfileEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  surname: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'enum', enum: Platform })
  platform: Platform

  @OneToMany(() => ReviewEntity, (review) => review.profile)
  reviews: ReviewEntity[];

  @OneToOne(() => TwogisProfilePlacementDetailEntity, { cascade: ['insert', 'update', 'soft-remove'] })
  twogisDetail?: TwogisProfilePlacementDetailEntity;

  @OneToOne(() => YandexProfilePlacementDetailEntity, { cascade: ['insert', 'update', 'soft-remove'] })
  yandexDetail?: YandexProfilePlacementDetailEntity;
}
