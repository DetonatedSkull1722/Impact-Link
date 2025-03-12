// routes/ngoRoutes.js
import express from 'express';
import multer from 'multer';
import { registerNGO } from '../Controllers/NGOController.js';
import { authenticate, authorize } from '../MiddleWare/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/register', upload.fields([
  { name: 'certificate', maxCount: 1 },
  { name: 'aadhar', maxCount: 1 }
]), registerNGO);

export default router;