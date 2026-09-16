import express from 'express';
import leaderboardControllers from '../controllers/leaderboard.controllers.js';

const router = express.Router();

router.get('/:gameId', leaderboardControllers.getClassement); //get gameID leaderboard
router.get('/', leaderboardControllers.getUserPlacement); // get user placement

export default {router};