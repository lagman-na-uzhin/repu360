import {Column, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {PLATFORMS} from "@domain/common/platfoms.enum";
import {RubricEntity} from "@infrastructure/entities/rubric/rubric.entity";

@Entity('external_rubric')
@Unique(['platform', 'externalId'])
export class ExternalRubricEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    externalId: string;

    @Column('uuid')
    rubricId: string;

    @Column()
    name: string;

    @Column()
    platform: PLATFORMS;

    @ManyToMany(() => RubricEntity, rubrics => rubrics.external)
    rubrics: RubricEntity[];
}
