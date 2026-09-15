import { Request, Response } from "express";
import z from "zod";
import authServices from "../services/auth.services.js";


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
    if(!service.success) new Error("AuthService getMe error: " + service.error);

    return res.status(200).json({
      user: service.user
    });
  }catch(error){
    console.error(error);
    return res.status(500).json({error: "Internal Server Error"});
  }
}

export default {me}