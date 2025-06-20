import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique, UpdateDateColumn
} from 'typeorm';
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




  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
  public deletedAt: Date | null;
}
