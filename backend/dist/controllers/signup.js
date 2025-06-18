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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.signup = void 0;
const check_1 = require("../validation/check");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "";
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    console.log(data);
    const check = check_1.signupSchema.safeParse(data);
    if (!check.success) {
        res.status(404).json({
            msg: "Invaild Input",
        });
    }
    const hashpw = yield bcryptjs_1.default.hashSync(data.password, 10);
    console.log(hashpw);
    try {
        const user = yield prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: hashpw,
            },
        });
        const token = jsonwebtoken_1.default.sign({ userid: user.id }, JWT_SECRET);
        res.json({
            token,
        });
    }
    catch (error) {
        return res.json({
            msg: error,
        });
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const check = check_1.signinSchema.safeParse(data);
    if (!check.success) {
        res.status(404).json({
            msg: "Invaild Input",
        });
    }
    try {
        const user = yield prisma.user.findFirst({
            where: {
                email: data.email,
            },
        });
        if (!user) {
            return res.status(404).json({
                msg: "User not found",
            });
        }
        const checkpw = bcryptjs_1.default.compare(data.password, user.password);
        if (!checkpw) {
            return res.status(404).json({
                msg: "wrong pw",
            });
        }
        const token = jsonwebtoken_1.default.sign({ userid: user.id }, JWT_SECRET);
        res.json({
            token,
        });
    }
    catch (error) {
        return res.json({
            msg: error,
        });
    }
});
exports.signin = signin;
