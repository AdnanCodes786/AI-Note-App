import express from 'express';
import { authenticateUser } from '../middlewares/authMiddleware';
import { getCurrentUser, login, logout, signup } from '../controllers/authController';

const authRouter = express.Router();

// Public routes
authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.get('/get-current-user', authenticateUser, getCurrentUser)
authRouter.post('/logout',authenticateUser,logout); 
export default authRouter;