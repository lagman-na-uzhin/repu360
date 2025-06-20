import {
    Column, CreateDateColumn, DeleteDateColumn,
    Entity,
    PrimaryColumn, UpdateDateColumn,
} from 'typeorm';
import {LANGUAGE} from "@domain/common/language.enum";

@Entity('auto_reply_template')
export class AutoReplyTemplateEntity {
    @PrimaryColumn("uuid")
    public id: string;

    @Column()
    public text: string;

    @Column({type: 'uuid'})
    public placementId: string;

    @Column()
    public language: LANGUAGE;



    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
    public deletedAt: Date | null;
}
