import { prisma } from "../config/prisma.js";

const getAllSuccess = async() => {
  try{
    let result = await prisma.success.findMany();
    if(!result) return {success: false}
    return {success: true, result}
  }catch(error){
    return {success: false, error};
  }
}

const getUserSuccess = async(userId: string) => {
  try{
    let result = await prisma.gameUserSuccess.findMany({where: {gameUserId:userId}, include: {success: true}});
    if(!result) return {success: false}
    return {success: true, result}
  }catch(error){
    return {success: false, error};
  }
}

export default {getAllSuccess, getUserSuccess}