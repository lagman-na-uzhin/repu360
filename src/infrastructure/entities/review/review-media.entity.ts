import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';
import { ReviewEntity } from '@infrastructure/entities/review/review.entity';

@Entity('review_media')
export class ReviewMediaEntity {
  @PrimaryColumn("uuid")
  public id: string;

  @Column()
  public reviewId: string;

  @Column()
  public url: string;

  @ManyToOne(() => ReviewEntity, (review) => review.media)
  @JoinColumn({ name: "review_id" })
  review: ReviewEntity;
}
