import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Statement } from "../entities/Statement";

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Statement, (statement) => statement.id)
  statement: Statement;

  @Column()
  date: string;

  @Column()
  description: string;

  @Column("decimal", { precision: 10, scale: 2 })
  amount!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  balance!: number;
}
