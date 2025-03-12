// routes/userRoutes.js
import express from 'express';
import { registerUser, loginUser, getUserRankings } from '../Controllers/UserController.js';
import { authenticate, authorize } from '../MiddleWare/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/rankings', getUserRankings);

export default router;