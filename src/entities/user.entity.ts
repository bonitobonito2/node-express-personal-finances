import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Category } from "./category.entity";
import { EncryptionTransformer } from "typeorm-encrypted";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column("text", {
    name: "password",
    transformer: new EncryptionTransformer({
      key: "e41c966f21f9e1577802463f8924e6a3fe3e9751f201304213b2f845d8841d61",
      algorithm: "aes-256-cbc",
      ivLength: 16,
      iv: "ff5ac19190424b1d88f9419ef949ae56",
    }),
  })
  password: string;

  @Column("boolean", { default: false })
  verifed: boolean = false;

  @OneToMany(() => Category, (category) => category.user)
  category: Category[];

  @Column("timestamp without time zone", { name: "createdAt", nullable: true })
  createdAt: Date | null;
}
