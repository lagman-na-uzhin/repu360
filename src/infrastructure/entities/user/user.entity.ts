import {PrimaryGeneratedColumn, Column, ManyToOne, Entity, OneToOne} from 'typeorm';
import { PartnerEntity } from 'src/infrastructure/entities/ partner/partner.entity';
import {UserRoleEntity} from "@infrastructure/entities/user/access/user-role.entity";

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column()
  name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    unique: true,
  })
  phone: string;

  @Column()
  password: string;

  @Column({ nullable: true, type: 'text' })
  avatar: string | null;

  @Column({ nullable: true })
  partnerId: string;

  @Column()
  roleId: string;

  @ManyToOne(() => PartnerEntity, (partner) => partner.users, {
    onDelete: 'CASCADE',
  })
  partner: PartnerEntity;

  @OneToOne(() => UserRoleEntity, {cascade: ['insert', 'soft-remove', 'update'], eager: true })
  role: UserRoleEntity;
}
