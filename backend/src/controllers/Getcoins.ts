import { PrismaClient } from "@prisma/client";

const prisma=new PrismaClient();
export const Getcoins=async(req:any,res:any)=>{
    const userid=req.userid;
    
    const user=await prisma.user.findUnique({
        where:{id:userid},
        select:{
            coins:true
        }
    })
    return res.json({
        user
    })
}