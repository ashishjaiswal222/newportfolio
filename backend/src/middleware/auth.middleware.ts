import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user with role
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: 'user' | 'admin';
      };
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secret) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role || 'user'
    };
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  authenticateToken(req, res, next);
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  authenticateToken(req, res, (err) => {
    if (err) return next(err);
    
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    next();
  });
};

export const requireUser = (req: Request, res: Response, next: NextFunction) => {
  authenticateToken(req, res, (err) => {
    if (err) return next(err);
    
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (req.user.role !== 'user') {
      return res.status(403).json({ message: 'User access required' });
    }
    
    next();
  });
}; 