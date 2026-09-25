import { Request, Response } from "express";
import achievementsServices from "../services/achievements.services.js";
import jwt from "jsonwebtoken";

const addAchievements = async (req: Request, res: Response) => {
  try{
    const auth = req.headers.authorization;

    if (!auth) return res.status(401).json({error: "Missing bearer"});
    const [type, token] = auth.split(" ");

    if (type !== "Bearer" || !token) return res.status(401).json({error: "Invalid bearer"});

    let tkn  = jwt.verify(token, process.env.GAME_JWT_SECRET!);
    if(!(tkn as any).gameId) return res.status(500).json({success: false, error: "Invalid game"});
    
    let userId = req.body.userId;
    let achievementId = req.body.achievement;

    let achieve = await achievementsServices.addAchievement(userId, achievementId, (tkn as any).gameId);
    if(!achieve.success) return res.status(500).json({success: false, error: "Error during process"});
    return res.status(200).json({success: true});
  }catch(error){
    console.error(error);
    return res.status(500).json({success: false, error});
  }
};

export default {addAchievements}