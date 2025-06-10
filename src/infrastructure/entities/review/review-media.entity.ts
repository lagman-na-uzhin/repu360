import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';
import { ReviewEntity } from '@infrastructure/entities/review/review.entity';

@Entity('review_media')
export class ReviewMediaEntity {
  @PrimaryColumn("uuid")
  public id: string;

  @Column({type: "uuid"})
  public reviewId: string;

  @Column()
  public url: string;

  @Column({ type: "timestamptz"})
  public createdAt: Date;

  @ManyToOne(() => ReviewEntity, (review) => review.media)
  @JoinColumn({ name: "review_id" })
  review: ReviewEntity;
}
