import { prisma } from "../config/prisma.js";

//

const getFriends = async(userId: string) => {
  try{
    let friends = await prisma.friendship.findMany({
      where: {
        OR: [
          {
            requesterId: userId,
          },
          {
            addresseeId: userId,
          },
        ],
      },
      include: {
        requester: {
          select: {
            avatarUrl: true,
            name: true
          }
        },
        addressee: {
          select: {
            avatarUrl: true,
            name: true
          }
        }
      },
    });

    return {success: true, friends};
  }catch(error){
    return {success: false, error};
  }
}

const askFriends = async(userId: string, friendUserId: string) => {
  try{
    let askFriends = await prisma.friendship.create({
      data: {
        requesterId: userId,
        addresseeId: friendUserId
      }
    });
    return {success: true, friends: askFriends};
  }catch(error){
    return {success: false, error};
  }
};

const acceptFriends = async (userId: string, friendsId: string) => {
  try {
    const friendAsk = await prisma.friendship.findFirst({
      where: {
        id: friendsId,
        status: 'PENDING',
        addresseeId: userId,
      },
    });

    if (!friendAsk) return {success: false, error: 'Friendship request not found'};

    const friendship = await prisma.friendship.update({
      where: {
        id: friendsId,
      },
      data: {
        status: 'ACCEPTED',
      },
    });

    return {success: true, friendship,};
  } catch (error) {
    return {success: false, error,};
  }
};

const declineFriends = async(userId: string, friendsId: string) => {
  try {
    const friendAsk = await prisma.friendship.findFirst({
      where: {
        id: friendsId,
        status: 'PENDING',
        addresseeId: userId,
      },
    });

    if (!friendAsk) return {success: false, error: 'Friendship request not found'};

    const friendship = await prisma.friendship.update({
      where: {
        id: friendsId,
      },
      data: {
        status: 'DECLINED',
      },
    });

    return {success: true, friendship,};
  } catch (error) {
    return {success: false, error,};
  }
};

const deleteFriend = async (userId: string, friendsId: string) => {
  try {
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          {
            addresseeId: userId,
            requesterId: friendsId,
          },
          {
            addresseeId: friendsId,
            requesterId: userId,
          },
        ],
      },
    });

    if (!friendship) return {success: false,error: 'Friendship not found'};

    await prisma.friendship.delete({
      where: {
        id: friendship.id,
      },
    });

    return {success: true};
  } catch (error) {
    return {success: false, error};
  }
};

export default {getFriends, askFriends, acceptFriends, declineFriends, deleteFriend}