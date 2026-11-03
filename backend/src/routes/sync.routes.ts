import express from 'express';
import syncControllers from '../controllers/sync.controllers.js';

const router = express.Router();

router.post('/playtime', syncControllers.syncPlaytime);
router.post('/successes', syncControllers.syncSuccesses);

export default {router};
