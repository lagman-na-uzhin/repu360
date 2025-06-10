import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique} from 'typeorm';
import { ProfileEntity } from '@infrastructure/entities/profile/profile.entity';

@Entity('twogis_profile_placement_detail')
@Unique(['externalId'])
export class TwogisProfilePlacementDetailEntity {
  @PrimaryColumn('uuid')
  profileId: string;

  @Column()
  externalId: string

  @OneToOne(() => ProfileEntity)
  @JoinColumn({name: 'profile_id'})
  profile: ProfileEntity;
}
