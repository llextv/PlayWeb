import { Request, Response } from "express";
import { z } from "zod";
import { verifyGame } from "../utils/gameAuth.js";
import syncServices from "../services/sync.services.js";

const KEY = z.string().regex(/^[a-z0-9_]{1,48}$/);

const PlaytimeBody = z.object({
  entries: z.array(z.object({
    userId: z.string().uuid(),
    seconds: z.number().int().min(0).max(10_000_000_000),
  })).min(1).max(500),
});

const SuccessesBody = z.object({
  catalog: z.array(z.object({
    key: KEY,
    title: z.string().trim().min(1).max(120),
    description: z.string().trim().max(500),
    rarity: z.enum(["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"]),
  })).max(300).optional(),
  unlocks: z.array(z.object({
    userId: z.string().uuid(),
    key: KEY,
    unlockedAt: z.string().datetime(),
  })).max(500),
});

const syncPlaytime = async (req: Request, res: Response) => {
  const gameRef = verifyGame(req);
  if (!gameRef) return res.status(401).json({ success: false, error: "Invalid game token" });
  const body = PlaytimeBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ success: false, error: "Invalid playtime payload" });
  const result = await syncServices.syncPlaytime(gameRef, body.data.entries);
  if (!result.success) return res.status(result.status).json({ success: false, error: result.error });
  return res.status(200).json({ success: true, updated: result.updated });
};

const syncSuccesses = async (req: Request, res: Response) => {
  const gameRef = verifyGame(req);
  if (!gameRef) return res.status(401).json({ success: false, error: "Invalid game token" });
  const body = SuccessesBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ success: false, error: "Invalid successes payload" });
  const result = await syncServices.syncSuccesses(gameRef, body.data.catalog, body.data.unlocks);
  if (!result.success) return res.status(result.status).json({ success: false, error: result.error });
  return res.status(200).json({ success: true, catalog: result.catalog, unlocked: result.unlocked });
};

export default { syncPlaytime, syncSuccesses };
