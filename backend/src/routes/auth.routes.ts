import { Router } from 'express';
import { adminLogin, adminLogout, verifyToken, getAdminProfile, refreshToken, forgotPassword, resetPassword, verifyResetToken } from '../controllers/auth.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limit login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 login requests per windowMs
  message: 'Too many login attempts, please try again later.'
});

// Rate limit forgot password endpoint
const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 forgot password requests per hour
  message: 'Too many password reset requests, please try again later.'
});

// Public routes
router.post('/login', loginLimiter, adminLogin);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify-reset-token/:token', verifyResetToken);

// Protected routes
router.post('/logout', authenticateToken, requireAdmin, adminLogout);
router.get('/verify', authenticateToken, requireAdmin, verifyToken);
router.get('/profile', authenticateToken, requireAdmin, getAdminProfile);

export default router; 