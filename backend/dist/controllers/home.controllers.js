import homeServices from "../services/home.services.js";
import authServices from "../services/auth.services.js";
const getHome = async (req, res) => {
    try {
        let games = await homeServices.getHome();
        if (!games.success)
            return new Error("Unable to find games");
        const user = req.user?.id ? await authServices.getMe(req.user.id) : null;
        return res.status(200).json({
            success: true,
            user: user?.user || null,
            games: games.games,
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
export default { getHome };
