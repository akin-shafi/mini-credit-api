import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "../entities/User";

@Entity("insights")
export class Insight {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  avgIncome: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  totalInflow: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  totalOutflow: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  netFlow: number;

  @Column("simple-json", { nullable: true })
  spendBuckets: Record<string, number>;

  @Column("simple-json", { nullable: true })
  riskFlags: string[];

  @CreateDateColumn()
  createdAt: Date;
}
