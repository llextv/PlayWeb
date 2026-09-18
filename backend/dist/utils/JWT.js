import jwt from "jsonwebtoken";
const generateToken = (userid) => {
    return jwt.sign({ id: userid }, process.env.JWT_SECRET);
};
const decodeToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};
export default { generateToken, decodeToken };
