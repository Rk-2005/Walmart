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
exports.addProduct = exports.getSpecific = exports.getAll = void 0;
const client_1 = require("@prisma/client");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const prisma = new client_1.PrismaClient();
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.product.findMany({});
    return res.json({
        result
    });
});
exports.getAll = getAll;
const getSpecific = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    console.log(id);
    const result = yield prisma.product.findUnique({
        where: { id: id }
    });
    return res.json({
        result
    });
});
exports.getSpecific = getSpecific;
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = req.body;
    console.log(data);
    const image = yield (0, cloudinary_1.default)((_a = req.file) === null || _a === void 0 ? void 0 : _a.path);
    console.log(image);
    if (!image) {
        return res.json({
            msg: "image error"
        });
    }
    const result = yield prisma.product.create({
        data: {
            name: data.name,
            description: data.description,
            price: parseInt(data.price),
            imageUrl: image,
        }
    });
    res.json({
        result
    });
});
exports.addProduct = addProduct;
