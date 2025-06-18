"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CartController_1 = require("../controllers/CartController");
const verify_1 = require("../middlewares/verify");
const router = express_1.default.Router();
router.get("/", verify_1.verify, CartController_1.GetOrders);
router.post("/add", verify_1.verify, CartController_1.Add);
exports.default = router;
