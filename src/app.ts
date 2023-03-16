import express, { Application } from "express";
import dotenv from "dotenv";
import { dbConfig } from "./database/db.config";
import { createConnection } from "typeorm";
import authRouter from "./routes/auth.routes";
import bodyParser from "body-parser";
import CategoryRouter from "./routes/category.routes";

dotenv.config();
const port = process.env.PORT;

createConnection(dbConfig)
  .then(() => {
    console.log("Connected to database");
    app.listen(port, (): void => {
      console.log("SERVER IS UP ON PORT:", port);
    });
  })
  .catch((error) => {
    console.log("Error connecting to database:", error);
  });

const app: Application = express();
app.use(bodyParser.json());

app.use("/auth", authRouter);

app.use("/category", CategoryRouter);
