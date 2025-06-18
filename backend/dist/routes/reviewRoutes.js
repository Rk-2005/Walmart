"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verify_1 = require("../middlewares/verify");
const ReviewController_1 = require("../controllers/ReviewController");
const multer_1 = __importDefault(require("../middlewares/multer"));
const router = express_1.default.Router();
router.get("/:id", verify_1.verify, ReviewController_1.GetReview);
router.post('/:id', verify_1.verify, multer_1.default.single('file'), ReviewController_1.PostReview);
exports.default = router;
