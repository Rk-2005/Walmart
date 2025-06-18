import  express  from "express";
import { verify } from "../middlewares/verify";
import { GetReview, PostReview } from "../controllers/ReviewController";
import upload from "../middlewares/multer";


const router=express.Router()

router.get("/:id",verify,GetReview)
router.post('/:id', verify, upload.single('file'), PostReview);


export default router