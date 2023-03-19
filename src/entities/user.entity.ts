import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Category } from "./category.entity";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Category, (category) => category.user)
  category: Category[];

  @Column("timestamp without time zone", { name: "createdAt", nullable: true })
  createdAt: Date | null;
}
