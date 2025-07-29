import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/config';
import { JWTPayload } from './auth.service';

export class AuthMiddleware {
  authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    // Try to get token from Authorization header
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      req.user = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name
      };
      next();
    } catch (error) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
  };

  requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    // For now, any authenticated user is considered admin
    // You can add role-based checks here if needed
    next();
  };

  // Combined middleware for admin routes
  requireAuth = (req: Request, res: Response, next: NextFunction) => {
    this.authenticateToken(req, res, (err) => {
      if (err) return next(err);
      this.requireAdmin(req, res, next);
    });
  };

  // Optional authentication - doesn't fail if no token
  optionalAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        req.user = {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name
        };
      } catch (error) {
        // Token is invalid, but we don't fail the request
        console.warn('Invalid token in optional auth:', error);
      }
    }

    next();
  };

  // Rate limiting for login attempts
  rateLimitLogin = (req: Request, res: Response, next: NextFunction) => {
    // Simple in-memory rate limiting (in production, use Redis)
    const clientIP = req.ip || 'unknown';
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxAttempts = 5;

    // This is a simple implementation - in production, use a proper rate limiting library
    if (!req.app.locals.loginAttempts) {
      req.app.locals.loginAttempts = new Map();
    }

    const attempts = req.app.locals.loginAttempts.get(clientIP) || [];
    const recentAttempts = attempts.filter((timestamp: number) => now - timestamp < windowMs);

    if (recentAttempts.length >= maxAttempts) {
      return res.status(429).json({ 
        message: 'Too many login attempts. Please try again later.' 
      });
    }

    // Add current attempt
    recentAttempts.push(now);
    req.app.locals.loginAttempts.set(clientIP, recentAttempts);

    next();
  };
}

// Export singleton instance
export const authMiddleware = new AuthMiddleware(); 