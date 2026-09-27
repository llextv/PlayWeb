import express from 'express';
import achievementsControllers from '../controllers/achievements.controllers.js';
const router = express.Router();

router.get('/unlock', achievementsControllers.addAchievements);

export default {router};