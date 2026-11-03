import { prisma } from "../config/prisma.js";

const getGames = async(userId: string) => {
  try{
    const user = await prisma.user.findUnique({
      where: { id: userId },
      omit: { token: true },
      include: {
        _count: {
          select: {
            friendshipsSent: { where: { status: "ACCEPTED" } },
            friendshipsReceived: { where: { status: "ACCEPTED" } },
          },
        },
      },
    });
    
    let games = await prisma.gameUser.findMany({
      where: {
        userId
      },
      include: {
        user: {
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

const markPlayed = async (userId: string, gameId: string) => {
  try {
    const game = await prisma.game.findFirst({
      where: { id: gameId, isActive: true },
      select: { id: true, launchUrl: true },
    });
    if (!game || !game.launchUrl) return { success: false as const, status: 404, error: "Game not found" };

    await prisma.gameUser.upsert({
      where: { userId_gameId: { userId, gameId } },
      create: { userId, gameId, playedHours: "0" },
      update: {},
    });
    return { success: true as const };
  } catch (error) {
    console.error("Game play tracking failed:", error);
    return { success: false as const, status: 500, error: "Internal Server Error" };
  }
};

export default {getGames, markPlayed}