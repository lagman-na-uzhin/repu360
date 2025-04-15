import {Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ReviewEntity} from "@infrastructure/entities/review/review.entity";

@Entity('review_complaint')
export class ReviewComplaintEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;


    // @ManyToOne(() => ReviewEntity, (review) => review., { onDelete: 'CASCADE' })
    // review: ReviewEntity
}
