import { Router } from 'express';
import * as blogController from '../controllers/blog.controller';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', blogController.getBlogs);
router.get('/featured', blogController.getFeaturedBlogs);
router.get('/:id', blogController.getBlogById);
router.get('/:id/related', blogController.getRelatedBlogs);
router.get('/:id/analytics', blogController.getBlogAnalytics);

// Admin routes (protected by middleware)
router.post('/', requireAuth, requireAdmin, blogController.createBlog);
router.put('/:id', requireAuth, requireAdmin, blogController.updateBlog);
router.delete('/:id', requireAuth, requireAdmin, blogController.deleteBlog);
router.patch('/:id/status', requireAuth, requireAdmin, blogController.updateBlogStatus);
router.put('/:id/seo', requireAuth, requireAdmin, blogController.updateBlogSEO);
router.post('/:id/like', blogController.likeBlog);
router.post('/:id/bookmark', blogController.bookmarkBlog);
router.put('/:id/pin', requireAuth, requireAdmin, blogController.togglePin);

export default router; 