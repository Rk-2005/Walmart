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
exports.GetReview = exports.PostReview = void 0;
const client_1 = require("@prisma/client");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const prisma = new client_1.PrismaClient();
// assume you have this util
const PostReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.userid); // from middleware
        const { type, content, rating } = req.body;
        const productId = parseInt(req.body.productId);
        console.log(req.body);
        console.log(productId);
        let mediaUrl = null;
        // Upload media if type is image/video/mixed
        if (type === 'image' || type === 'video' || type === 'mixed') {
            if (!req.file) {
                return res.status(400).json({ message: 'File is required for media review' });
            }
            console.log(req.file);
            const uploadedUrl = yield (0, cloudinary_1.default)(req.file.path);
            if (!uploadedUrl) {
                return res.status(500).json({ message: 'Failed to upload file' });
            }
            mediaUrl = uploadedUrl;
        }
        // Coins based on type
        let coins = 0;
        if (type === 'text')
            coins = 5;
        else if (type === 'image')
            coins = 10;
        else if (type === 'video')
            coins = 20;
        else if (type === 'mixed')
            coins = 15; // Example: 5 for text + 10 for image
        // Create Review
        const review = yield prisma.review.create({
            data: {
                userid: userId,
                productid: productId,
                type,
                content: content || null,
                mediaUrl,
                rating: parseInt(rating),
                coinsGiven: coins,
            },
        });
        // Update user's coin balance
        yield prisma.user.update({
            where: { id: userId },
            data: {
                coins: { increment: coins },
            },
        });
        res.status(201).json({ message: 'Review posted successfully', review });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.PostReview = PostReview;
const GetReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = parseInt(req.params.id);
    const results = yield prisma.product.findMany({
        where: {
            id: productId
        },
        select: {
            name: true,
            description: true,
            reviews: {
                select: {
                    content: true,
                    mediaUrl: true,
                    rating: true,
                    createdAt: true,
                    user: true
                }
            }
        }
    });
    return res.json({
        results
    });
});
exports.GetReview = GetReview;
