"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const multer_1 = __importDefault(require("../middlewares/multer"));
const verify_1 = require("../middlewares/verify");
const router = express_1.default.Router();
router.get("/all", verify_1.verify, productController_1.getAll);
router.get("/:id", verify_1.verify, productController_1.getSpecific);
router.post("/", verify_1.verify, multer_1.default.single("image"), productController_1.addProduct);
exports.default = router;
