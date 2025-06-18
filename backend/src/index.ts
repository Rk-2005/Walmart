import express from "express"
import authRoute from "./routes/authRoutes"
import productRoute from "./routes/productRoute"
import ordersRoute from "./routes/ordersRoute"
import reviewRoutes from "./routes/reviewRoutes"
import CoinRouter from "./routes/mycoins"
import cors from "cors"

const app=express()

app.use(cors())
app.use(express.json())

app.use("/api/auth",authRoute)
app.use("/api/products",productRoute)
app.use("/api/orders",ordersRoute)
app.use("/api/reviews",reviewRoutes);
app.use("/api/user",CoinRouter);
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})