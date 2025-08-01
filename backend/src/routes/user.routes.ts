import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { 
  validateUserRegistration, 
  validateUserLogin, 
  validateProfileUpdate, 
  validatePasswordReset, 
  validateForgotPassword 
} from '../middleware/validation.middleware';

const router = Router();

// Public routes
router.post('/register', validateUserRegistration, userController.register);
router.post('/login', validateUserLogin, userController.login);
router.post('/refresh-token', userController.refreshToken);
router.post('/forgot-password', validateForgotPassword, userController.forgotPassword);
router.post('/reset-password', validatePasswordReset, userController.resetPassword);
router.get('/verify-email/:token', userController.verifyEmail);

// Protected routes (user only) - Fixed to use only requireAuth
router.get('/profile', requireAuth, userController.getCurrentUser);
router.put('/profile', requireAuth, validateProfileUpdate, userController.updateProfile);
router.post('/logout', requireAuth, userController.logout);

// User activity and comments
router.get('/comments', requireAuth, userController.getUserComments);
router.get('/activity', requireAuth, userController.getUserActivity);

export default router; 