import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import * as analyticsController from '../controllers/analytics.controller';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';
import { validateForgotPassword, validatePasswordReset } from '../middleware/validation.middleware';

const router = Router();

// Public routes
router.post('/login', adminController.adminLogin);
router.post('/forgot-password', validateForgotPassword, adminController.adminForgotPassword);
router.post('/reset-password', validatePasswordReset, adminController.adminResetPassword);

// Protected routes (admin only)
router.get('/profile', requireAuth, requireAdmin, adminController.getAdminProfile);
router.put('/profile', requireAuth, requireAdmin, adminController.updateAdminProfile);
router.post('/logout', requireAuth, requireAdmin, adminController.adminLogout);

// User management (admin only)
router.get('/users', requireAuth, requireAdmin, adminController.getAllUsers);
router.get('/users/:id', requireAuth, requireAdmin, adminController.getUserById);
router.put('/users/:id/status', requireAuth, requireAdmin, adminController.updateUserStatus);

// Analytics routes (admin only)
router.get('/analytics', requireAuth, requireAdmin, analyticsController.getAnalytics);
router.get('/analytics/contacts', requireAuth, requireAdmin, analyticsController.getContactAnalytics);
router.get('/analytics/testimonials', requireAuth, requireAdmin, analyticsController.getTestimonialAnalytics);

export default router; 