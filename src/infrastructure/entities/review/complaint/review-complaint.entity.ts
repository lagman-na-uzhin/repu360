import {Entity, PrimaryColumn} from "typeorm";

@Entity('review_complaint')
export class ReviewComplaintEntity {
    @PrimaryColumn("uuid")
    public id: string;


    // @ManyToOne(() => ReviewEntity, (review) => review., { onDelete: 'CASCADE' })
    // review: ReviewEntity
}
