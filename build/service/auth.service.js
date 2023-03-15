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
exports.AuthService = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
class AuthService {
    constructor() {
        this.userRepo = (0, typeorm_1.getRepository)(user_entity_1.User);
    }
    getUser(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepo.findOneBy({ username: userName });
        });
    }
    createUser(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.userRepo.insert({
                username: userInfo.userName,
                password: userInfo.password,
            });
            if (data)
                return true;
            return false;
        });
    }
    changePassword(userName, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUser(userName);
            user.password = password;
            if (yield this.userRepo.save(user))
                return true;
            return false;
        });
    }
}
exports.AuthService = AuthService;
