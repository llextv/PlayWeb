import { Request, Response } from "express";
import z from "zod";
import authServices from "../services/auth.services.js";
import JWT from "../utils/JWT.js";


const me = async (req: Request, res: Response) => {
  try{
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    let service = await authServices.getMe(userId);
    if(!service.success) return new Error("AuthService getMe error: " + service.error);

    return res.status(200).json({
      user: service.user
    });
  }catch(error){
    console.error(error);
    return res.status(500).json({error: "Internal Server Error"});
  }
}

const register = async(req: Request, res: Response) => {
  try{
    let service = await authServices.register();
    if(!service.success) return new Error("Register error: " + service.error);
    if(!service.token) return new Error("Register token error: " + service.error);

    return res.status(200).json({success: true, token: service.token});
  }catch(error){
    console.error(error);
    return res.status(500).json({error: "Internal Server Error"});
  }
}

export default {me, register}