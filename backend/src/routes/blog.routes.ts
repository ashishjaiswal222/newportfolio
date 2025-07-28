import { Router } from 'express';
import * as blogController from '../controllers/blog.controller';

const router = Router();

// Public routes
router.get('/', blogController.getBlogs);
router.get('/:id', blogController.getBlogById);

// Admin routes (will be protected by middleware)
router.post('/', blogController.createBlog);
router.put('/:id', blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);

export default router; 