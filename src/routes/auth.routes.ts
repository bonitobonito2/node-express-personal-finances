import express from "express";
import {
  changePassword,
  login,
  registration,
  verifeEmail,
} from "../controller/auth/auth.controller";
import { loginValidation } from "../requestValidations/auth/login.joy";
import { validateRegistration } from "../requestValidations/auth/registration.joy";
import { changePasswordValidate } from "../requestValidations/auth/changePassword.joy";

const authRouter = express.Router();

console.log(2);
authRouter.post("/registration", validateRegistration, registration);

authRouter.post("/login", loginValidation, login);

authRouter.post("/change-password", changePasswordValidate, changePassword);

authRouter.get("/verife-email/:verifeKey", verifeEmail);

export default authRouter;
