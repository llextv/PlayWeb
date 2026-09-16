import { prisma } from "../config/prisma.js";

const getGames = async(userId: string) => {
  try{
    const user = await prisma.user.findUnique({
      where: { id: userId },
      omit: { token: true },
    });
    let games = await prisma.gameUser.findMany({
      where: {
        userId
      },
      include: {
        user: {
          include: {
            _count: {
              select: {
                friendshipsSent: { where: { status: "ACCEPTED" } },
                friendshipsReceived: { where: { status: "ACCEPTED" } },
              },
            },
          },
          omit: {
            token: true,
          },
        },
        game: {
          include: {
            successes: true,
          },
        },
        successes: {
          include: {
            success: true
          }
        }
      }
    });
    return {success: true, user, games}
  }catch(error){
    console.error("Game Failed failed:", error);
    return {success: false, error}
  }
}

export default {getGames}