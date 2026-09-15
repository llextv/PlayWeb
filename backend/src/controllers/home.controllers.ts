import { Request, Response } from "express";
import homeServices from "../services/home.services.js";


const getHome = async(req: Request, res: Response) => {
  try{
    let games = await homeServices.getHome();
    if(!games.success) return new Error("Unable to find games");
    return res.status(200).json({success: true, games: games.games});
  }catch(error){
    return res.status(500).json({error: "Internal Server Error"});
  }
};

export default {getHome}