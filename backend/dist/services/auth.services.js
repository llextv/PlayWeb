import { prisma } from "../config/prisma.js";
import JWT from "../utils/JWT.js";
import crypto from "node:crypto";
const getMe = async (userId) => {
    try {
        let user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            omit: {
                token: true
            }
        });
        if (!user)
            return { success: false, error: "Not find" };
        return { success: true, user };
    }
    catch (error) {
        console.error("Auth getMe failed:", error);
        return { success: false, error };
    }
};
const register = async () => {
    try {
        let user = await prisma.user.create({
            data: {
                status: "ONLINE",
                token: ""
            }
        });
        let id = user.id;
        let token = JWT.generateToken(id);
        await prisma.user.update({
            where: {
                id
            },
            data: {
                token
            }
        });
        return { success: true, token };
    }
    catch (error) {
        console.error("Auth register failed:", error);
        return { success: false, error };
    }
};
const updateAvatar = async (userId, avatarUrl) => {
    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { avatarUrl },
            omit: { token: true },
        });
        return { success: true, user };
    }
    catch (error) {
        console.error("Auth avatar update failed:", error);
        return { success: false, error };
    }
};
const updateName = async (userId, name) => {
    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { name },
            omit: { token: true },
        });
        return { success: true, user };
    }
    catch (error) {
        console.error("Auth name update failed:", error);
        return { success: false, error };
    }
};
const getOrCreateProfileToken = async (userId) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { profileToken: true },
        });
        if (!user)
            return { success: false, error: "User not found" };
        const profileToken = user.profileToken || crypto.randomBytes(18).toString("hex");
        if (!user.profileToken) {
            await prisma.user.update({
                where: { id: userId },
                data: { profileToken },
            });
        }
        return { success: true, profileToken };
    }
    catch (error) {
        console.error("Profile link generation failed:", error);
        return { success: false, error };
    }
};
const getPublicProfile = async (profileToken) => {
    try {
        const user = await prisma.user.findUnique({
            where: { profileToken },
            select: {
                id: true,
                name: true,
                avatarUrl: true,
                createdAt: true,
                isPublic: true,
                _count: {
                    select: {
                        friendshipsSent: { where: { status: "ACCEPTED" } },
                        friendshipsReceived: { where: { status: "ACCEPTED" } },
                    },
                },
                achievements: {
                    select: {
                        achievementId: true,
                    },
                },
                games: {
                    select: {
                        playedHours: true,
                        game: { select: { name: true } },
                    },
                },
            },
        });
        if (!user)
            return { success: false, status: 404, error: "Profile not found" };
        if (!user.isPublic)
            return { success: false, status: 403, error: "Profile is private" };
        const earnedSuccesses = await prisma.gameUserSuccess.findMany({
            where: {
                gameUser: {
                    userId: user.id,
                },
            },
            select: {
                successId: true,
            },
        });
        const earnedAchievementIds = user.achievements.map((achievement) => achievement.achievementId);
        return {
            success: true,
            profile: {
                id: user.id,
                name: user.name || "Joueur",
                avatarUrl: user.avatarUrl,
                createdAt: user.createdAt,
                friendsCount: user._count.friendshipsSent + user._count.friendshipsReceived,
                games: user.games.map((game) => ({
                    name: game.game.name,
                    playedHours: Number(game.playedHours || 0),
                })),
                achievementsCount: new Set([
                    ...earnedSuccesses.map((success) => success.successId),
                    ...earnedAchievementIds,
                ]).size,
            },
        };
    }
    catch (error) {
        console.error("Public profile lookup failed:", error);
        return { success: false, status: 500, error };
    }
};
const updatePrivacy = async (userId, isPublic) => {
    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { isPublic },
            omit: { token: true, profileToken: true },
        });
        return { success: true, user };
    }
    catch (error) {
        console.error("Profile privacy update failed:", error);
        return { success: false, error };
    }
};
export default {
    getMe,
    register,
    updateAvatar,
    updateName,
    getOrCreateProfileToken,
    getPublicProfile,
    updatePrivacy,
};
