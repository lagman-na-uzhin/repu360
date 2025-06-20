import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { ReviewEntity } from '@infrastructure/entities/review/review.entity';

@Entity('review_media')
export class ReviewMediaEntity {
  @PrimaryColumn("uuid")
  public id: string;

  @Column({type: "uuid"})
  public reviewId: string;

  @Column()
  public url: string;

  @ManyToOne(() => ReviewEntity, (review) => review.media)
  @JoinColumn({ name: "review_id" })
  review: ReviewEntity;





  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
  public deletedAt: Date | null;
}
