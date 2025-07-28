import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';

const router = Router();

// Admin analytics routes (will be protected by middleware)
router.get('/', analyticsController.getAnalytics);
router.get('/contacts', analyticsController.getContactAnalytics);
router.get('/testimonials', analyticsController.getTestimonialAnalytics);

export default router; 