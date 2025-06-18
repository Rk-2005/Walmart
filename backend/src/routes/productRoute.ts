import  express  from "express";
import { addProduct, getAll, getSpecific } from "../controllers/productController";
import upload from "../middlewares/multer";
import { verify } from "../middlewares/verify"

const router=express.Router()

router.get("/all",getAll)

router.get("/:id",verify,getSpecific)

router.post("/",verify,upload.single("image"),addProduct)

export default router