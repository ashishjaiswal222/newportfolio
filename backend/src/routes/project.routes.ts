import { Router } from 'express';
import * as projectController from '../controllers/project.controller';

const router = Router();

// Public routes
router.get('/', projectController.getProjects);

// Admin routes (will be protected by middleware)
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

export default router; 