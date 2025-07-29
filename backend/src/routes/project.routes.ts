import express from 'express';
import {
  getProjects,
  getFeaturedProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  toggleFeatured,
  addRating,
  getProjectRatings,
  incrementStars,
  getProjectAnalytics,
  getProjectCategories,
  getProjectStatuses,
  testProjects
} from '../controllers/project.controller';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes - SPECIFIC ROUTES FIRST
router.get('/', getProjects);
router.get('/test', testProjects); // Test endpoint
router.get('/featured', getFeaturedProjects);
router.get('/analytics/summary', getProjectAnalytics);
router.get('/categories', getProjectCategories);
router.get('/statuses', getProjectStatuses);

// PARAMETERIZED ROUTES LAST
router.get('/:id', getProject);
router.get('/:id/ratings', getProjectRatings);
router.post('/:id/ratings', addRating);
router.post('/:id/stars', incrementStars);

// Protected routes (admin only)
router.post('/', requireAuth, requireAdmin, createProject);
router.put('/:id', requireAuth, requireAdmin, updateProject);
router.delete('/:id', requireAuth, requireAdmin, deleteProject);
router.patch('/:id/featured', requireAuth, requireAdmin, toggleFeatured);

export default router; 