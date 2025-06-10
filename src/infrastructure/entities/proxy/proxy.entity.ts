import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('proxy')
export class ProxyEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  ip: string;

  @Column()
  port: number;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column({ default: false })
  isBlocked: boolean;

  @Column({nullable: true, type: 'uuid'})
  companyId: string | null;
}
