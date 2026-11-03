import express from 'express';
import gameControllers from '../controllers/game.controllers.js';

const router = express.Router();

router.get('/', gameControllers.getGames);
router.post('/:gameId/play', gameControllers.playGame);

export default {router};