"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "";
const verify = (req, res, next) => {
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
        return res.json({
            msg: "User not authorized"
        });
    }
    try {
        const decode = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (!decode || !decode.userid) {
            return res.status(404).json({
                msg: "Error"
            });
        }
        req.userid = decode.userid;
        next();
    }
    catch (e) {
        return res.status(503).json({
            e
        });
    }
};
exports.verify = verify;
