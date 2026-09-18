import express from 'express';
import friendControllers from '../controllers/friend.controllers.js';
const router = express.Router();
router.get("/", friendControllers.getFriends);
router.post("/:friendUserId", friendControllers.askFriends);
router.post("/decline/:friendId", friendControllers.declineFriends);
router.post("/accept/:friendId", friendControllers.acceptFriends);
router.delete("/:friendId", friendControllers.deleteFriend);
export default { router };
