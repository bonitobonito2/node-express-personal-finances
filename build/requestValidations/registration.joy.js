"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegistration = exports.registration = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registration = joi_1.default.object({
    userName: joi_1.default.string().required(),
    password: joi_1.default.string().required().min(4),
});
function validateRegistration(req, res, next) {
    const { error } = exports.registration.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.message });
    }
    next();
}
exports.validateRegistration = validateRegistration;
