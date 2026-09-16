import { Request, Response } from "express";
import gameServices from "../services/game.services.js";


const getGames = async(req: Request, res: Response) => {
  try{
    let userId = req.user.id;
    let games = await gameServices.getGames(userId);
    if(!games.success) return new Error("Game Controller failed");

    return {success: true, games}
  }catch(error){
    console.error(error);
    return res.status(500).json({sucess: false, error: "Internal Server Error"});
  }
};

export default {getGames}