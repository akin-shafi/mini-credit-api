import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "../entities/User";

@Entity("bureau_reports")
export class BureauReport {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column("int")
  score: number;

  @Column()
  risk_band: string;

  @Column("int")
  enquiries_6m: number;

  @Column({ type: "int" })
  defaults!: number;

  @Column("int")
  open_loans: number;

  @Column("int")
  trade_lines: number;

  @CreateDateColumn()
  createdAt: Date;
}
