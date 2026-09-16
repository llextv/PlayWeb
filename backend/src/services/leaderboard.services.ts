import { prisma } from "../config/prisma.js";


const getUserPlacement = async(userId: string) => {
  try{
    let result = await prisma.leaderboard.findMany({
      where: {
        period: "ALL_TIME",
        scores: {
          some: {
            userId
          }
        }
      },
      include: {
        scores: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });
    return {success: true, result};
  }catch(error){
    console.error(error);
    return {success: false, error};
  }
}

const getPlacement = async(gameId: string) => {
  try{
    let result = await prisma.leaderboard.findUnique({
      where: {
        gameId_period: {
          gameId,
          period: "ALL_TIME"
        }
      },
      include: {
        scores: {
          take: 50,
          orderBy: {
            score: "desc"
          },
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });
    return {success: true, result};
  }catch(error){
    console.error(error);
    return {success: false, error};
  }
}

export default {getUserPlacement, getPlacement}