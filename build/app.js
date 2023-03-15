"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_config_1 = require("./database/db.config");
const typeorm_1 = require("typeorm");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const port = process.env.PORT;
(0, typeorm_1.createConnection)(db_config_1.dbConfig)
    .then(() => {
    console.log("Connected to database");
    app.listen(port, () => {
        console.log("SERVER IS UP ON PORT:", port);
    });
})
    .catch((error) => {
    console.log("Error connecting to database:", error);
});
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use("/auth", auth_routes_1.default);
