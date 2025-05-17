import express from 'express';
import { registerForEvent } from '../controllers/registration.controller.js';

const router = express.Router();

router.post('/register', registerForEvent);

export default router;
