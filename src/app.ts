import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes";
import bodyParser from "body-parser";
import CategoryRouter from "./routes/category.routes";
import { myDataSource } from "./database/db.config";

dotenv.config();
const port = process.env.PORT;

myDataSource
  .initialize()
  .then(() => {
    console.log("Connected to database!");
    app.listen(port, (): void => {
      console.log("SERVER IS UP ON PORT:", port);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

const app: Application = express();
app.use(bodyParser.json());

app.use("/auth", authRouter);

app.use("/category", CategoryRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  return res.status(500).json(err.message);
});
