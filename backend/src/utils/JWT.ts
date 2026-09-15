import jwt from "jsonwebtoken";


const generateToken = (userid: string) => {
  return jwt.sign({ id: userid }, process.env.JWT_SECRET!);
}

const decodeToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
}

export default {generateToken, decodeToken};