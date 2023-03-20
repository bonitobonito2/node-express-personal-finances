import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes";
import bodyParser from "body-parser";
import CategoryRouter from "./routes/category.routes";
import { myDataSource } from "./database/db.config";
import jwt from "jsonwebtoken";
import RecordRouter from "./routes/record.routes";

dotenv.config();
const port = process.env.PORT;

myDataSource
  .initialize()
  .then(() => {
    console.log("Connected to database!");

    app.listen(port, (): void => {
      console.log("SERVER IS UP ON PORT:", port);

      console.log(
        "----------READ README FILE FOR BETTER DOCCUMENTATION---------"
      );
      console.log(
        "----------READ README FILE FOR BETTER DOCCUMENTATION---------"
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
app.use(bodyParser.json());

app.use("/auth", authRouter);

app.use((req: Request, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new Error("u need token on protected routes");
  }
  try {
    const decoded = jwt.verify(token, "topSecret21");
    req["decoded"] = decoded;
    next();
  } catch (Err) {
    return res.status(401).send(Err);
  }
});
app.use("/category", CategoryRouter);

app.use("/record", RecordRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  return res.status(500).json(err.message);
});
