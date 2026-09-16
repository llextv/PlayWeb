import express from 'express';
import authRoutes from './auth.routes.js';
import { authenticate } from '../middlewares/auth.middlewares.js';
import homeRoutes from './home.routes.js';
import friendRoutes from './friend.routes.js';
import gameRoutes from './game.routes.js';
import leaderboardRoutes from './leaderboard.routes.js';

const router = express.Router();

router.use("/auth", authRoutes.router);

router.use(authenticate);
router.use("/home", homeRoutes.router);
router.use("/friends", friendRoutes.router);
router.use("/game", gameRoutes.router);
router.use("/ranking", leaderboardRoutes.router);

export default {router};