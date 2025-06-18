import { Request, Response } from "express";
import { signinSchema, signupSchema } from "../validation/check";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET ||  "";

export const signup = async (req: any, res: any) => {
  const data = req.body;
  console.log(data)
  const check = signupSchema.safeParse(data);

  if (!check.success) {
    res.status(404).json({
      msg: "Invaild Input",
    });
  }
  const hashpw = await bcrypt.hashSync(data.password, 10);
  console.log(hashpw)
  try {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashpw,
      },
    });
    
    const token = jwt.sign({ userid: user.id }, JWT_SECRET);

    res.json({
      token,
    });
  } catch (error) {
    return res.json({
      msg: error,
    });
  }
};

export const signin = async (req: any, res: any) => {
  const data = req.body;

  const check = signinSchema.safeParse(data);

  if (!check.success) {
    res.status(404).json({
      msg: "Invaild Input",
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }
    const checkpw = bcrypt.compare(data.password, user.password);
    if (!checkpw) {
      return res.status(404).json({
        msg: "wrong pw",
      });
    }
    const token = jwt.sign({ userid: user.id }, JWT_SECRET);

    res.json({
      token,
    });
  } catch (error) {
    return res.json({
      msg: error,
    });
  }
};
