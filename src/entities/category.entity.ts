import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./user.entity";
import { Records } from "./records.entity";

@Entity("category")
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoryName: string;

  @ManyToOne(() => User, (user) => user.category)
  user: User;

  @OneToMany(() => Records, (category) => category.category)
  record: Records;
}
