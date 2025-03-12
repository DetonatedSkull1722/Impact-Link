// routes/secureFileRoutes.js
import express from 'express';
import { getSignedUrl } from '../Controllers/SecureFileController.js';
import { authenticate, authorize } from '../MiddleWare/auth.js';

const router = express.Router();

router.get('/signed-url', authenticate, getSignedUrl);

export default router;