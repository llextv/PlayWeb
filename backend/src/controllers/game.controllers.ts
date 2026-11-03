import { Request, Response } from "express";
import gameServices from "../services/game.services.js";


const getGames = async(req: Request, res: Response) => {
  try{
    let userId = req.user.id;
    let games = await gameServices.getGames(userId);
    if(!games.success) return new Error("Game Controller failed");

    const gameUsers = games.games || [];
    return res.status(200).json({
      success: true,
      user: games.user || null,
      games: gameUsers,
    });
  }catch(error){
    console.error(error);
    return res.status(500).json({sucess: false, error: "Internal Server Error"});
  }
};

const playGame = async (req: Request, res: Response) => {
  const gameId = String(req.params.gameId || "");
  if (!/^[0-9a-f-]{36}$/i.test(gameId)) return res.status(400).json({ success: false, error: "Invalid game" });
  const result = await gameServices.markPlayed(req.user.id, gameId);
  if (!result.success) return res.status(result.status).json({ success: false, error: result.error });
  return res.status(200).json({ success: true });
};

export default {getGames, playGame}