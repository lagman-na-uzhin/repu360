import {
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import {MAIL_TEMPLATE_TYPE} from "@application/interfaces/services/mailer/mailer-service.interface";

@Entity('mail')
export default class MailEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({
        enum: MAIL_TEMPLATE_TYPE,
    })
    public template: MAIL_TEMPLATE_TYPE;

    @Column()
    public userId: string;

    @Column()
    public email: string;

    @Column({
        type: 'json',
    })
    public payload: object;

    @Column({
        nullable: true,
        type: 'timestamptz',
    })
    public sendDate?: Date;

    @ManyToOne(() => UserEntity, (user) => user.id, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: UserEntity;



    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
    public deletedAt: Date | null;
}
