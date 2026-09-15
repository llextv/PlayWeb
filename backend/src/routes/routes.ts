import express from 'express';
import authRoutes from './auth.routes.js';
import { authenticate } from '../middlewares/auth.middlewares.js';
import homeRoutes from './home.routes.js';

const router = express.Router();

router.use("/auth", authRoutes.router);

router.use(authenticate);
router.use("/home", homeRoutes.router);


export default {router};