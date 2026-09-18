import express from 'express';
import homeControllers from '../controllers/home.controllers.js';
const router = express.Router();
router.get('/', homeControllers.getHome);
export default { router };
