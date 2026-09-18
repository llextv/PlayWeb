import { prisma } from "../config/prisma.js";
const getHome = async () => {
    try {
        let games = await prisma.game.findMany({
            where: {
                isActive: true
            }
        });
        return { success: true, games };
    }
    catch (error) {
        console.error(error);
        return { success: false, error };
    }
};
export default { getHome };
