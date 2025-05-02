import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mediator')
export class MediatorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  ip: string;

  @Column()
  port: number;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column({ type: 'timestamptz', nullable: true })
  checkedAt: Date;

  @Column({
    type: 'enum',
    enum: ["TEST", "TEST2"],
    default: "TEST",
  })
  type: "TEST" | "TEST2";

  @Column({ default: false })
  isBlocked: boolean;
}
