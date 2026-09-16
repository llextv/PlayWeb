import express from 'express';
import { authenticate } from '../middlewares/auth.middlewares.js';
import authControllers from '../controllers/auth.controllers.js';

const router = express.Router();

router.post('/register', authControllers.register);
router.get('/profile/:profileToken', authControllers.getPublicProfile);

router.use(authenticate);
router.get('/me', authControllers.me);
router.patch('/me/avatar', authControllers.updateAvatar);
router.patch('/me/name', authControllers.updateName);
router.get('/me/profile-link', authControllers.getProfileLink);
router.patch('/me/privacy', authControllers.updatePrivacy);

export default {router};