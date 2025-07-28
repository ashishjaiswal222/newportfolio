import { Router } from 'express';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonialStatus,
  deleteTestimonial
} from '../controllers/testimonial.controller';
import { validateTestimonial } from '../middlewares/validateTestimonial';

const router = Router();

// GET /testimonials (all or by status)
router.get('/', getTestimonials);

// POST /testimonials (create new)
router.post('/', validateTestimonial, createTestimonial);

// PUT /testimonials/:id/status (approve/reject)
router.put('/:id/status', updateTestimonialStatus);

// DELETE /testimonials/:id (delete)
router.delete('/:id', deleteTestimonial);

export default router; 