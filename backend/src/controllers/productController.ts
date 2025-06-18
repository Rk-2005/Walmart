import { PrismaClient } from "@prisma/client"
import uploadOnCloud from "../config/cloudinary";

const prisma = new PrismaClient();
export const getAll=async(req:any,res:any)=>{
    const result=await prisma.product.findMany({});

    return res.json({
        result
    })
}

export const getSpecific=async(req:any,res:any)=>{
    const id=parseInt(req.params.id);
    console.log(id);
    const result=await prisma.product.findUnique({
        where:{id:id}
    })
    return res.json({
        result
    })
}

export const addProduct=async(req:any,res:any)=>{
    const data=req.body;
    console.log(data)
    const image = await uploadOnCloud(req.file?.path);
    console.log(image)
    if(!image){
        return res.json({
           msg: "image error"
        });
    }
  
        const result=await prisma.product.create({
            data:{
                name:data.name,
                description:data.description,
                price:parseInt(data.price),
                imageUrl:image,
                
            }
        })
        res.json({
            result
        })
    
}