import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const testimonialSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.string().min(2, 'Role is required'),
  company: z.string().min(2, 'Company name is required'),
  content: z.string().min(10, 'Testimonial must be at least 10 characters'),
  rating: z.number().min(1).max(5),
});

export function validateTestimonial(req: Request, res: Response, next: NextFunction) {
  try {
    // Convert rating to number if sent as string
    if (typeof req.body.rating === 'string') {
      req.body.rating = parseInt(req.body.rating, 10);
    }
    testimonialSchema.parse(req.body);
    next();
  } catch (err: any) {
    return res.status(400).json({ message: 'Validation failed', errors: err.errors });
  }
} 