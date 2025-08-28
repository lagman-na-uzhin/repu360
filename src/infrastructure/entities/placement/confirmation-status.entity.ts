import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity('placement_moder_confirmation')
export class PlacementModerConfirmation {
    @PrimaryColumn("uuid")
    public id: string;

    @Column()
    public name: boolean;
    @Column()
    public address: boolean;
    @Column()
    public referencePoint: boolean;
    @Column()
    public entrance: boolean;
    rubrics
    schedule
    contacts
}
