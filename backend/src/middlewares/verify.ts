import { NextFunction } from "express";
import jwt from "jsonwebtoken"
const JWT_SECRET=process.env.JWT_SECRET || "";

export const verify = (req: any, res: any, next: NextFunction) => {
  const token = req.headers.authorization;
  console.log(token)
  if(!token){
    return res.json({
        msg:"User not authorized"
    })
  }
  try{
      const decode=jwt.verify(token,JWT_SECRET) as {userid:number};
      if(!decode || !decode.userid){
        return res.status(404).json({
          msg:"Error"
        });
      }
      req.userid=decode.userid;
      next()
  }catch(e){
    return res.status(503).json({
      e
    })
  }
};
