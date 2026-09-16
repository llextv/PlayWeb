import { prisma } from "../config/prisma.js";

const getGames = async(userId: string) => {
  try{
    let games = await prisma.gameUser.findUnique({
      where: {
        id: userId
      },
      include: {
        successes: {
          include: {
            success: true
          }
        }
      }
    });
    return {success: true, games}
  }catch(error){
    console.error("Game Failed failed:", error);
    return {success: false, error}
  }
}

export default {getGames}