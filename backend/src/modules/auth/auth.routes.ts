import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthMiddleware } from './auth.middleware';

export const authRoutes = (
  router: Router, 
  authController: AuthController, 
  authMiddleware: AuthMiddleware
) => {
  // Public routes
  router.post('/login', authMiddleware.rateLimitLogin, authController.adminLogin);
  router.post('/forgot-password', authController.forgotPassword);
  router.post('/reset-password', authController.resetPassword);
  router.get('/verify-reset-token/:token', authController.verifyResetToken);
  router.post('/refresh', authController.refreshToken);

  // Protected routes
  router.post('/logout', authMiddleware.authenticateToken, authController.adminLogout);
  router.get('/profile', authMiddleware.authenticateToken, authController.getAdminProfile);
  router.get('/verify', authMiddleware.authenticateToken, authController.verifyToken);

  return router;
}; 