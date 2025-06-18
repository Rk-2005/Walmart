import  express  from "express";
import { Add, GetOrders} from "../controllers/CartController";
import { verify } from "../middlewares/verify";


const router=express.Router()

router.get("/",verify,GetOrders)
router.post("/add",verify,Add)


export default router