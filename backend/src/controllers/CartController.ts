import { PrismaClient } from "@prisma/client";

const prisma=new PrismaClient()

export const Add=async (req:any,res:any)=>{
    const data=req.body;
    const id=req.userid;
    console.log(id)
    const order=await prisma.orders.create({
        data:{
            userId:id,
            productId:data.productId,
            status:data.status,
        }
    })
    res.json({
        order
    })
}

export const GetOrders=async (req:any,res:any)=>{
    const id=req.userid;
    console.log(id)
    const result=await prisma.orders.findMany({
        where:{
            userId:id
        },
        select:{
            status:true,
            user:true,
            product:true
        }
    })
    
    return res.json({
        result
    })
}

