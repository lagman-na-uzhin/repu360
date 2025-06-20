import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';
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

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
  public deletedAt: Date | null;
}
