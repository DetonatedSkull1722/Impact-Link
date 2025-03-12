// routes/driveRoutes.js
import express from 'express';
import multer from 'multer';
import { createEvent, getEvents, participateInEvent, updateEvent } from '../Controllers/DriveController.js';
import { authenticate, authorize } from '../MiddleWare/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/create',authenticate, upload.single('image'), createEvent);
router.get('/get', getEvents);
router.post('/:id/participate', authenticate, participateInEvent);
router.put('/:id', authenticate, updateEvent);

export default router;