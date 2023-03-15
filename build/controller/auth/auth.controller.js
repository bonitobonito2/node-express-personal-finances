"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.login = exports.registration = void 0;
const auth_service_1 = require("../../service/auth.service");
const registration = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userName = request.body["userName"];
    const password = request.body["password"];
    const authService = new auth_service_1.AuthService();
    const userExsists = yield authService.getUser(userName);
    if (userExsists) {
        return response.status(404).json("user with this userName already exsists");
    }
    if (yield authService.createUser({ userName: userName, password: password }))
        return response.json(`${userName} created`);
    return response.status(403).json("something went wrong");
});
exports.registration = registration;
const login = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userName = request.body["userName"];
    const password = request.body["password"];
    const authService = new auth_service_1.AuthService();
    const userExsists = yield authService.getUser(userName);
    if (!userExsists) {
        return response.json("user doesnot exsists");
    }
    if (userExsists.password == password) {
        return response.json({ succses: true });
    }
    else {
        return response.status(404).json("incorrect password");
    }
});
exports.login = login;
const changePassword = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userName = request.body["userName"];
    const currentPassword = request.body["currentPassword"];
    const newPassword = request.body["newPassword"];
    const authService = new auth_service_1.AuthService();
    const userExsts = yield authService.getUser(userName);
    if (userExsts && currentPassword == userExsts.password) {
        const passwordChanged = yield authService.changePassword(userExsts.username, newPassword);
        return response.json({ passwordChanged });
    }
    else {
        return response
            .status(404)
            .json("user doesnot exsists or current password is incorrect");
    }
});
exports.changePassword = changePassword;
