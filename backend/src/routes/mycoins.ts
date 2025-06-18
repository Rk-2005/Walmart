import  express  from "express";

import { verify } from "../middlewares/verify";
import { Getcoins } from "../controllers/Getcoins";


const router=express.Router()

router.get("/coins",verify,Getcoins)


export default router