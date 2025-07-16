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
import {ProfileId} from "@domain/review/model/profile/profile";
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





    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
    public deletedAt: Date | null;
}
