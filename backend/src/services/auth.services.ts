import { success } from "zod"
import { prisma } from "../config/prisma.js"


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
    return {success: false, error}
  }
}

export default {getMe}