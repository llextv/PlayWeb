import { Request } from "express";
import jwt from "jsonwebtoken";

export const verifyGame = (req: Request): string | null => {
  const auth = req.headers.authorization;
  const secret = process.env.GAME_JWT_SECRET;
  if (!auth || !secret) return null;
  const [type, token] = auth.split(" ");
  if (type !== "Bearer" || !token) return null;
  try {
    const decoded = jwt.verify(token, secret) as { gameId?: unknown };
    return typeof decoded?.gameId === "string" && decoded.gameId ? decoded.gameId : null;
  } catch {
    return null;
  }
};
