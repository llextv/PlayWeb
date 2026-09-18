import express from 'express';
import successControllers from '../controllers/success.controllers.js';
const router = express.Router();
router.get('/', successControllers.getAllSuccess); //get all success
router.get('/user', successControllers.getUserSuccess); //get all user success
export default { router };
