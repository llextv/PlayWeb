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
        isActive: true,
      },
      include: {
        successes: true,
        gameUsers: {
          where: { userId },
          include: {
            successes: {
              include: {
                success: true,
              },
            },
          },
        },
      },
    });

    const gameUsers = games.map(({ gameUsers, ...game }) => {
      const gameUser = gameUsers[0];

      return {
        id: gameUser?.id || `${userId}-${game.id}`,
        userId,
        gameId: game.id,
        status: gameUser?.status || "JOINED",
        stats: gameUser?.stats || null,
        joinedAt: gameUser?.joinedAt || null,
        playedHours: gameUser?.playedHours || "0",
        successes: gameUser?.successes || [],
        game,
      };
    });

    return {success: true, user, games: gameUsers}
  }catch(error){
    console.error("Game Failed failed:", error);
    return {success: false, error}
  }
}

export default {getGames}