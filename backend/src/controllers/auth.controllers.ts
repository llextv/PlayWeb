import { Request, Response } from "express";
import { z } from "zod";
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
    if(!service.success) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

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
    if(!service.success || !service.token) return new Error("Service error");

    return res.status(200).json({success: true, token: service.token});
  }catch(error){
    console.error(error);
    return res.status(500).json({error: "Pseudo alrealy exist"});
  }
}

const updateAvatar = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const result = z.object({
    avatarUrl: z.union([z.string().url(), z.literal("")]).nullable(),
  }).safeParse(req.body);

  if (!userId) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: "avatarUrl must be a valid image URL or null",
    });
  }

  const service = await authServices.updateAvatar(userId, result.data.avatarUrl || null);
  if (!service.success) {
    return res.status(500).json({ success: false, error: "Unable to update avatar" });
  }

  return res.status(200).json({ success: true, user: service.user });
};

const updateName = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const result = z.object({
    name: z.string().trim().min(3).max(24),
  }).safeParse(req.body);

  if (!userId) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: "name must contain between 3 and 24 characters",
    });
  }

  const service = await authServices.updateName(userId, result.data.name);
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  void authServices.updateGameName(token as string, req.user.id, result.data.name).catch((err) => {
    console.error("updateGameName failed:", err);
  });

  if (!service.success) {
    return res.status(500).json({ success: false, error: "Unable to update name" });
  }

  return res.status(200).json({ success: true, user: service.user });
};

const getProfileLink = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

  const service = await authServices.getOrCreateProfileToken(userId);
  if (!service.success || !service.profileToken) {
    return res.status(500).json({ success: false, error: "Unable to create profile link" });
  }

  return res.status(200).json({
    success: true,
    profileToken: service.profileToken,
    profilePath: `/profil/partage.html?token=${encodeURIComponent(service.profileToken)}`,
  });
};

const getPublicProfile = async (req: Request, res: Response) => {
  const profileToken = z.string().regex(/^[a-f0-9]{36}$/i).safeParse(req.params.profileToken);
  if (!profileToken.success) return res.status(404).json({ success: false, error: "Profile not found" });

  const service = await authServices.getPublicProfile(profileToken.data);
  if (!service.success) return res.status(service.status || 500).json({ success: false, error: service.error });
  res.set("Cache-Control", "public, max-age=30, stale-while-revalidate=60");
  return res.status(200).json(service);
};

const updatePrivacy = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const result = z.object({ isPublic: z.boolean() }).safeParse(req.body);
  if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });
  if (!result.success) return res.status(400).json({ success: false, error: "isPublic must be boolean" });

  const service = await authServices.updatePrivacy(userId, result.data.isPublic);
  if (!service.success) return res.status(500).json({ success: false, error: "Unable to update privacy" });
  return res.status(200).json({ success: true, isPublic: result.data.isPublic });
};

export default {
  me,
  register,
  updateAvatar,
  updateName,
  getProfileLink,
  getPublicProfile,
  updatePrivacy,
}