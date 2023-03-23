import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes";
import bodyParser from "body-parser";
import CategoryRouter from "./routes/category.routes";
import { myDataSource } from "./database/db.config";
import jwt from "jsonwebtoken";
import RecordRouter from "./routes/record.routes";
import cors from "cors";
import { validateToken } from "./middlewares/validateToken.middleware";

dotenv.config();
const port = process.env.PORT;

myDataSource
  .initialize()
  .then(() => {
    if (port === undefined)
      throw new Error("port is undefined, fill the .env folder");
    console.log("Connected to database!");

    app.listen(port, (): void => {
      console.log("SERVER IS UP ON PORT:", port);

      console.log(
        "----------READ README FILE FOR BETTER DOCCUMENTATION---------\n"
      );
      console.log(
        "----------READ README FILE FOR BETTER DOCCUMENTATION---------\n"
      );
      console.log(
        "----------READ README FILE FOR BETTER DOCCUMENTATION---------"
      );
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

const app: Application = express();

app.use(cors());

app.use(bodyParser.json());

app.use("/auth", authRouter);

app.use(validateToken);

app.use("/category", CategoryRouter);

app.use("/record", RecordRouter);

app.use((err: Error, req: Request, res: Response) => {
  return res.status(503).json(err.message);
});
