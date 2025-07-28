import { Router } from 'express';
import { authController } from './auth.controller';
import { authMiddleware } from './auth.middleware';
import { authRoutes } from './auth.routes';
import { authService } from './auth.service';
import { emailService } from './email.service';

// Export the router for use in main app
const authRouter = Router();

// Apply routes
authRoutes(authRouter, authController, authMiddleware);

// Export everything needed for the module
export {
  authController,
  authMiddleware,
  authService,
  emailService,
  authRouter as default
}; 