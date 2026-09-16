import { prisma } from "../config/prisma.js"
import JWT from "../utils/JWT.js"

const getMe = async (userId: string) => {
  try{
    let user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      omit: {
        token: true
      }
    })
    if(!user) return {success: false, error: "Not find"}

    return {success: true, user};
  }catch(error){
    console.error("Auth getMe failed:", error);
    return {success: false, error}
  }
}

const register = async() => {
  try{
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
    return {success: true, token}
  }catch(error){
    console.error("Auth register failed:", error);
    return {success: false, error}
  }
}

const updateAvatar = async (userId: string, avatarUrl: string | null) => {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      omit: { token: true },
    });

    return { success: true, user };
  } catch (error) {
    console.error("Auth avatar update failed:", error);
    return { success: false, error };
  }
};

const updateName = async (userId: string, name: string) => {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name },
      omit: { token: true },
    });

    return { success: true, user };
  } catch (error) {
    console.error("Auth name update failed:", error);
    return { success: false, error };
  }
};

export default {getMe, register, updateAvatar, updateName}