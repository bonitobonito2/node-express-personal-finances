import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Category } from "./category.entity";
import { RecordTypeEnum } from "../enums/records.enum";
import { Process } from "../enums/process.enum";

@Entity("records")
export class Records {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoryName: string;

  @Column()
  descriotion: string;

  @Column()
  price: string;

  @Column({ enum: Process })
  process: string;

  @Column({ enum: RecordTypeEnum })
  type: RecordTypeEnum;

  @ManyToOne(() => Category, (user) => user.record)
  category: Category[];
}
