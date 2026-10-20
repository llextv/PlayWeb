import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import moderationServices from "../services/moderation.services.js";

const verifyGame = (req: Request): string | null => {
  const auth = req.headers.authorization;
  if (!auth) return null;
  const [type, token] = auth.split(" ");
  if (type !== "Bearer" || !token) return null;
  try {
    const decoded = jwt.verify(token, process.env.GAME_JWT_SECRET!) as { gameId?: string };
    return decoded?.gameId || null;
  } catch {
    return null;
  }
};

const NameBody = z.object({
  name: z.string().trim().min(1).max(64),
  bannedBy: z.string().trim().max(64).optional(),
});

const banName = async (req: Request, res: Response) => {
  if (!verifyGame(req)) return res.status(401).json({ success: false, error: "Invalid game token" });
  const body = NameBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ success: false, error: "Invalid name" });
  try {
    await moderationServices.banName(body.data.name, body.data.bannedBy);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Ban name failed:", error);
    return res.status(500).json({ success: false, error: "Unable to ban name" });
  }
};

const unbanName = async (req: Request, res: Response) => {
  if (!verifyGame(req)) return res.status(401).json({ success: false, error: "Invalid game token" });
  const body = NameBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ success: false, error: "Invalid name" });
  try {
    await moderationServices.unbanName(body.data.name);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Unban name failed:", error);
    return res.status(500).json({ success: false, error: "Unable to unban name" });
  }
};

export default { banName, unbanName };
