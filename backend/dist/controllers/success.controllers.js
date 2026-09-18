import successServices from "../services/success.services.js";
import authServices from "../services/auth.services.js";
const getAllSuccess = async (req, res) => {
    try {
        let success = await successServices.getAllSuccess();
        if (!success.result)
            return new Error("GetAllSuccess failed");
        return res.status(200).json({ success: true, result: success.result });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};
const getUserSuccess = async (req, res) => {
    try {
        let userId = req.user.id;
        let success = await successServices.getUserSuccess(userId);
        if (!success.result)
            return new Error("GetUserSuccess failed");
        const user = await authServices.getMe(userId);
        return res.status(200).json({ success: true, user: user.user || null, result: success.result });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};
export default { getAllSuccess, getUserSuccess };
