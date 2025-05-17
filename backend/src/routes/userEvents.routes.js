import express from 'express'

import {registerForEvent, checkRegistrationStatus, getUserEvents, cancelEventRegistration} from '../controllers/userEvents.controller.js'
import {confirmUser} from '../middleware/auth.middleware.js'

const router = express.Router();
router.get('/events/myEvents', confirmUser, getUserEvents);
router.post('/events/:eventId/register', confirmUser, registerForEvent);
router.get('/events/:eventId/registration-status', confirmUser, checkRegistrationStatus);

router.delete('/events/:eventId/cancel-registration', confirmUser, cancelEventRegistration);



export default router;