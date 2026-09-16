import express from 'express';
import { authenticate } from '../middlewares/auth.middlewares.js';
import authControllers from '../controllers/auth.controllers.js';

const router = express.Router();

router.post('/register', authControllers.register);

router.use(authenticate);
router.get('/me', authControllers.me);
router.patch('/me/avatar', authControllers.updateAvatar);

export default {router};