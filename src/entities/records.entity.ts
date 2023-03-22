import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Category } from "./category.entity";
import { RecordTypeEnum } from "../enums/records.enum";
import { Status } from "../enums/status.enum";
@Entity("records")
export class Records {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  descriotion: string;

  @Column()
  price: number;

  @Column({ enum: Status, nullable: true })
  status: string;

  @Column({ enum: RecordTypeEnum })
  type: RecordTypeEnum;

  @ManyToOne(() => Category, (user) => user.record)
  category: Category;

  @Column("timestamp without time zone", { name: "createdAt", nullable: true })
  createdAt: Date | null;
}
