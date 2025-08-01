import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Testimonial validation schema
const testimonialSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.string().min(2, 'Role is required'),
  company: z.string().min(2, 'Company name is required'),
  content: z.string().min(10, 'Testimonial must be at least 10 characters'),
  rating: z.number().min(1).max(5),
});

// User registration validation schema
const userRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// User login validation schema
const userLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Profile update validation schema
const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  bio: z.string().optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  location: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  socialLinks: z.array(z.string().url('Please enter valid URLs')).optional(),
  skills: z.array(z.string()).optional(),
});

// Password reset validation schema
const passwordResetSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Forgot password validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
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

export function validateUserRegistration(req: Request, res: Response, next: NextFunction) {
  try {
    userRegistrationSchema.parse(req.body);
    next();
  } catch (err: any) {
    return res.status(400).json({ message: 'Validation failed', errors: err.errors });
  }
}

export function validateUserLogin(req: Request, res: Response, next: NextFunction) {
  try {
    userLoginSchema.parse(req.body);
    next();
  } catch (err: any) {
    return res.status(400).json({ message: 'Validation failed', errors: err.errors });
  }
}

export function validateProfileUpdate(req: Request, res: Response, next: NextFunction) {
  try {
    profileUpdateSchema.parse(req.body);
    next();
  } catch (err: any) {
    return res.status(400).json({ message: 'Validation failed', errors: err.errors });
  }
}

export function validatePasswordReset(req: Request, res: Response, next: NextFunction) {
  try {
    passwordResetSchema.parse(req.body);
    next();
  } catch (err: any) {
    return res.status(400).json({ message: 'Validation failed', errors: err.errors });
  }
}

export function validateForgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    forgotPasswordSchema.parse(req.body);
    next();
  } catch (err: any) {
    return res.status(400).json({ message: 'Validation failed', errors: err.errors });
  }
} 