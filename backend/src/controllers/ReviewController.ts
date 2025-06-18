


import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import uploadOnCloud from '../config/cloudinary';
const prisma=new PrismaClient()
 // assume you have this util

export const PostReview = async (req: any, res: any) => {
  try {
    const userId = parseInt(req.userid); // from middleware

    const { type, content, rating } = req.body;
   const productId = parseInt(req.body.productId);
    console.log(req.body)
    console.log(productId)
    let mediaUrl = null;

    // Upload media if type is image/video/mixed
    if (type === 'image' || type === 'video' || type === 'mixed') {
      if (!req.file) {
        return res.status(400).json({ message: 'File is required for media review' });
      }
      console.log(req.file)
      const uploadedUrl = await uploadOnCloud(req.file.path);

      if (!uploadedUrl) {
        return res.status(500).json({ message: 'Failed to upload file' });
      }

      mediaUrl = uploadedUrl;
    }

    // Coins based on type
    let coins = 0;
    if (type === 'text') coins = 5;
    else if (type === 'image') coins = 10;
    else if (type === 'video') coins = 20;
    else if (type === 'mixed') coins = 15; // Example: 5 for text + 10 for image

    // Create Review
    const review = await prisma.review.create({
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
    await prisma.user.update({
      where: { id: userId },
      data: {
        coins: { increment: coins },
      },
    });

    res.status(201).json({ message: 'Review posted successfully', review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

 
export const GetReview=async(req:any,res:any)=>{
    const productId=parseInt(req.params.id);

    const results=await prisma.product.findMany({
      where:{
        id:productId
      },
      select:{
        name:true,
        description:true,
        reviews:{
  
          select:{
            content:true,
            mediaUrl:true,
            rating:true,
            createdAt:true,
            user:true
          }
        }
        
      }
    })

    return res.json({
      results
    })
}