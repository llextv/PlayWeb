import achievementsServices from "../services/achievements.services.js";
import jwt from "jsonwebtoken";
const addAchievements = async (req, res) => {
    try {
        const auth = req.headers.authorization;
        if (!auth)
            return res.status(401).json({ error: "Missing bearer" });
        const [type, token] = auth.split(" ");
        if (type !== "Bearer" || !token)
            return res.status(401).json({ error: "Invalid bearer" });
        let tkn = jwt.verify(token, process.env.GAME_JWT_SECRET);
        if (!tkn.gameId)
            return res.status(500).json({ success: false, error: "Invalid game" });
        let userId = req.body.userId;
        let achievementId = req.body.achievement;
        let achieve = await achievementsServices.addAchievement(userId, achievementId, tkn.gameId);
        if (!achieve.success)
            return res.status(500).json({ success: false, error: "Error during process" });
        return res.status(200).json({ success: true });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error });
    }
};
export default { addAchievements };
