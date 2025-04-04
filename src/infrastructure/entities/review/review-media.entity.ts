import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ReviewEntity } from '@infrastructure/entities/review/review.entity';

@Entity('review_media')
export class ReviewMediaEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public reviewId: string;

  @Column()
  public url: string;

  @Column()
  public dateCreated: Date;

  @ManyToOne(() => ReviewEntity, (review) => review.media, { onDelete: 'CASCADE'})
  review: ReviewEntity;
}
