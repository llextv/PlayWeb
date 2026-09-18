import { prisma } from "../config/prisma.js";
const getAllSuccess = async () => {
    try {
        let result = await prisma.success.findMany({
            include: {
                game: true,
            },
        });
        if (!result)
            return { success: false };
        return { success: true, result };
    }
    catch (error) {
        return { success: false, error };
    }
};
const getUserSuccess = async (userId) => {
    try {
        let result = await prisma.gameUserSuccess.findMany({
            where: {
                gameUser: {
                    userId,
                },
            },
            include: {
                success: {
                    include: {
                        game: true,
                    },
                },
            },
        });
        if (!result)
            return { success: false };
        return { success: true, result };
    }
    catch (error) {
        return { success: false, error };
    }
};
export default { getAllSuccess, getUserSuccess };
