import express from 'express';
import moderationControllers from '../controllers/moderation.controllers.js';
const router = express.Router();

router.post('/names/ban', moderationControllers.banName);
router.post('/names/unban', moderationControllers.unbanName);

export default {router};
