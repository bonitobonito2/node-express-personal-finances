"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controller/auth/auth.controller");
const login_joy_1 = require("../requestValidations/auth/login.joy");
const registration_joy_1 = require("../requestValidations/auth/registration.joy");
const changePassword_joy_1 = require("../requestValidations/auth/changePassword.joy");
const authRouter = express_1.default.Router();
authRouter.post("/registration", registration_joy_1.validateRegistration, auth_controller_1.registration);
authRouter.post("/login", login_joy_1.loginValidation, auth_controller_1.login);
authRouter.post("/change-password", changePassword_joy_1.changePasswordValidate, auth_controller_1.changePassword);
exports.default = authRouter;
