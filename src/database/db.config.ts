import dotenv from "dotenv";
import { User } from "../entities/user.entity";
import { ConnectionOptions } from "typeorm";
import { Category } from "../entities/category.entity";
import { Records } from "../entities/records.entity";
dotenv.config();
export const dbConfig: ConnectionOptions = {
  type: "postgres",
  host: process.env.DATABASE_MASTER_HOST,
  port: 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User, Category, Records],
  synchronize: true,
};
