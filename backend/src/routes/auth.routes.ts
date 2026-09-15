import express from 'express';
import { authenticate } from '../middlewares/auth.middlewares.js';

const router = express.Router();

router.post('/');


router.use(authenticate);
router.get('/me');
router.patch('/');
router.delete('/');

export default router;