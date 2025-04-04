import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn, Unique} from 'typeorm';
import { ProfileEntity } from '@infrastructure/entities/profile/profile.entity';

@Entity('yandex_profile_placement_detail')
@Unique(['externalId'])
export class YandexProfilePlacementDetailEntity {
  @PrimaryColumn()
  profileId: string;

  @Column()
  externalId: string

  @OneToOne(() => ProfileEntity, { onDelete: 'CASCADE' })
  @JoinColumn({name: 'profile_id'})
  profile: ProfileEntity;
}
