import express from 'express';
import gameControllers from '../controllers/game.controllers.js';

const router = express.Router();

router.get('/', gameControllers.getGames);

export default {router};