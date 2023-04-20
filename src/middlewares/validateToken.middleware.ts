import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const validateToken: RequestHandler = (req, res, next) => {
  console.log("testt ", req.url);
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new Error("u need token on protected routes");
  }
  try {
    const decoded = jwt.verify(token, "topSecret21");
    req["decoded"] = decoded;
    next();
  } catch (Err) {
    return res.status(404).send(Err);
  }
};
