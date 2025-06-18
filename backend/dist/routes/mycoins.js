"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verify_1 = require("../middlewares/verify");
const Getcoins_1 = require("../controllers/Getcoins");
const router = express_1.default.Router();
router.get("/coins", verify_1.verify, Getcoins_1.Getcoins);
exports.default = router;
