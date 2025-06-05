import {
    Column,
    Entity,
    PrimaryColumn,
} from 'typeorm';
import {LANGUAGE} from "@domain/common/language.enum";

@Entity('auto_reply')
export class ReplyTemplateEntity {
    @PrimaryColumn("uuid")
    public id: string;

    @Column()
    public text: string;

    @Column()
    public placementId: string;

    @Column()
    public language: LANGUAGE;
}
