import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn, Unique} from 'typeorm';
import { ProfileEntity } from '@infrastructure/entities/profile/profile.entity';

@Entity('yandex_profile_placement_detail')
@Unique(['externalId'])
export class YandexProfilePlacementDetailEntity {
  @PrimaryColumn('uuid')
  profileId: string;

  @Column()
  externalId: string

  @OneToOne(() => ProfileEntity)
  @JoinColumn({name: 'profile_id'})
  profile: ProfileEntity;
}
