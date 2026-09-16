import { Request, Response } from "express";
import leaderboardServices from "../services/leaderboard.services.js";
import {z} from "zod";
import authServices from "../services/auth.services.js";

const gameId = z.string().min(3).max(50);

const getUserPlacement = async(req: Request, res: Response) => {
  try{
    let userId = req.user.id;
    let result = await leaderboardServices.getUserPlacement(userId);
    if(!result.success) return new Error("GetUserPlacement Failed");

    return res.status(200).json({success: true, result: result.result})
  }catch(error){
    console.error(error);
    return res.status(500).json({success: false, error: "Internal Server Error"});
  }
};

const getClassement = async(req: Request, res: Response) => {
  try{
    let gameID = gameId.parse(req.params.gameId);
    let result = await leaderboardServices.getPlacement(gameID);
    if(!result.success) return new Error("GetPlacement Failed");
    const user = req.user?.id ? await authServices.getMe(req.user.id) : null;

    return res.status(200).json({success: true, user: user?.user || null, result: result.result})
  }catch(error){
    console.error(error);
    return res.status(500).json({success: false, error: "Internal Server Error"});
  }
};

export default {getClassement, getUserPlacement};