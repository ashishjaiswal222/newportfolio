import { Router } from 'express';
import * as commentController from '../controllers/comment.controller';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Get comments for a blog (public)
router.get('/:blogId/comments', commentController.getComments);

// Create comment (requires authentication)
router.post('/:blogId/comments', requireAuth, commentController.createComment);

// Update comment (requires authentication - author or admin)
router.put('/comments/:id', requireAuth, commentController.updateComment);

// Delete comment (requires authentication - author or admin)
router.delete('/comments/:id', requireAuth, commentController.deleteComment);

// Moderate comment (admin only)
router.put('/comments/:id/moderate', requireAuth, requireAdmin, commentController.moderateComment);

export default router; 