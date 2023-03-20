import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Category } from "./category.entity";
import { RecordTypeEnum } from "../enums/records.enum";
import { Process } from "../enums/process.enum";

@Entity("records")
export class Records {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  descriotion: string;

  @Column()
  price: number;

  @Column({ enum: Process, nullable: true })
  status: string;

  @Column({ enum: RecordTypeEnum })
  type: RecordTypeEnum;

  @ManyToOne(() => Category, (user) => user.record)
  category: Category;

  @Column("timestamp without time zone", { name: "createdAt", nullable: true })
  createdAt: Date | null;
}
