import {
    Column,
    Entity,
    PrimaryColumn,
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
}
