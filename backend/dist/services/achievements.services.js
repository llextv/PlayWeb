import { prisma } from "../config/prisma.js";
const addAchievement = async (userId, successId, gameId) => {
    try {
        const achievement = await prisma.achievement.findFirst({
            where: {
                id: successId,
                gameId
            }
        });
        if (!achievement)
            return { success: false };
        const uAchieve = await prisma.userAchievement.create({
            data: {
                achievementId: successId,
                userId: userId
            }
        });
        if (!uAchieve)
            return { success: false };
        return { success: true };
    }
    catch (error) {
        console.error(error);
        return { success: false };
    }
};
export default { addAchievement };
