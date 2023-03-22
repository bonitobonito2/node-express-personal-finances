import dotenv from "dotenv";
import { User } from "../entities/user.entity";
import { DataSource } from "typeorm";
import { Category } from "../entities/category.entity";
import { Records } from "../entities/records.entity";
dotenv.config();

export const myDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_MASTER_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User, Category, Records],
  synchronize: true,
});
