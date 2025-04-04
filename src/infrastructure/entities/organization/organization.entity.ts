import { OrganizationPlacementEntity } from '../placement/organization-placement.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PartnerEntity } from '@infrastructure/entities/ partner/partner.entity';

@Entity('organization')
export class OrganizationEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    partnerId: string;

    @OneToMany(() => OrganizationPlacementEntity, orgPlacement => orgPlacement.organization)
    placements: OrganizationPlacementEntity[];

    @ManyToOne(() => PartnerEntity, {
        onDelete: 'CASCADE',
    })
    partner: PartnerEntity;
}
