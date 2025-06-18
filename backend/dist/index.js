"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoute_1 = __importDefault(require("./routes/productRoute"));
const ordersRoute_1 = __importDefault(require("./routes/ordersRoute"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const mycoins_1 = __importDefault(require("./routes/mycoins"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", authRoutes_1.default);
app.use("/api/products", productRoute_1.default);
app.use("/api/orders", ordersRoute_1.default);
app.use("/api/reviews", reviewRoutes_1.default);
app.use("/api/user", mycoins_1.default);
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
