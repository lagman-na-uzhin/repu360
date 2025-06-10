import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';
import { ReviewEntity } from '@infrastructure/entities/review/review.entity';
import {ProfileId} from "@domain/review/profile";
import {ReplyType} from "@domain/review/value-object/reply/reply-type.vo";
import {ReplyId} from "@domain/review/model/review/reply/reply";
import {ProfileEntity} from "@infrastructure/entities/profile/profile.entity";

@Entity('review_reply')
export class ReviewReplyEntity {
    @PrimaryColumn("uuid")
    public id: string;

    @Column()
    public externalId: string;

    @Column()
    public text: string;

    @Column()
    public isOfficial: boolean;

    @Column({type: "uuid"})
    public profileId: string;

    @Column({type: "uuid"})
    public reviewId: string;

    @Column()
    public type: string;

    @ManyToOne(() => ProfileEntity)
    @JoinColumn({ name: "profile_id" })
    profile: ProfileEntity;

    @ManyToOne(() => ReviewEntity)
    @JoinColumn({ name: "review_id" })
    review: ReviewEntity;
}
