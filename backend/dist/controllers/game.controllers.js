import gameServices from "../services/game.services.js";
const getGames = async (req, res) => {
    try {
        let userId = req.user.id;
        let games = await gameServices.getGames(userId);
        if (!games.success)
            return new Error("Game Controller failed");
        const gameUsers = games.games || [];
        return res.status(200).json({
            success: true,
            user: games.user || null,
            games: gameUsers,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ sucess: false, error: "Internal Server Error" });
    }
};
export default { getGames };
