import dotenv from "dotenv";
import { User } from "../entities/user.entity";
import { DataSource } from "typeorm";
import { Category } from "../entities/category.entity";
import { Records } from "../entities/records.entity";
dotenv.config();

export const myDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_MASTER_HOST,
  port: parseInt(process.env.DATABASE_PORT), // or the port number you are using
  username: process.env.DATABASE_USER,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  entities: [User, Category, Records],
  synchronize: true,
  // extra: {
  //   ssl: true,
  //   sslmode: "require",
  // },
});

// postgres://bonitobonito2:QsS3jlkdyCR5@ep-wispy-term-125918.eu-central-1.aws.neon.tech/neondb
