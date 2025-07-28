import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { EmailService } from './email.service';
import { AppDataSource } from '../../config/ormconfig';
import { AdminUser } from '../../models/AdminUser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { ADMIN_LOGIN_USERNAME, ADMIN_LOGIN_PASSWORD, JWT_SECRET } from '../../config/config';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
      };
    }
  }
}

interface JWTPayload {
  id: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

export class AuthController {
  private authService: AuthService;
  private emailService: EmailService;

  constructor(authService: AuthService, emailService: EmailService) {
    this.authService = authService;
    this.emailService = emailService;
  }

  adminLogin = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Check against environment variables
      if (!ADMIN_LOGIN_USERNAME || !ADMIN_LOGIN_PASSWORD) {
        console.error('Admin credentials not configured in environment variables');
        return res.status(500).json({ message: 'Server configuration error' });
      }

      // Validate credentials
      if (email !== ADMIN_LOGIN_USERNAME || password !== ADMIN_LOGIN_PASSWORD) {
        // Log failed attempt
        this.logLoginAttempt(email, req.ip || 'unknown', false, 'Invalid credentials', req.get('User-Agent') || 'unknown', new Date());
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Get or create admin user in database
      const admin = await this.authService.getOrCreateAdminUser(email, password);

      // Generate tokens
      const { accessToken, refreshToken } = this.authService.generateTokens(admin);

      // Log successful login
      this.logLoginAttempt(email, req.ip || 'unknown', true, 'Login successful', req.get('User-Agent') || 'unknown', new Date());

      res.json({
        message: 'Login successful',
        user: {
          id: admin.id,
          email: admin.email,
          name: admin.name
        },
        token: accessToken,
        refreshToken: refreshToken
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  adminLogout = async (req: Request, res: Response) => {
    try {
      // In a production environment, you might want to blacklist the token
      res.json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
      }

      try {
        const newAccessToken = await this.authService.refreshAccessToken(refreshToken);
        
        res.json({
          message: 'Token refreshed successfully',
          token: newAccessToken
        });
      } catch (error) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      // Check if admin user exists in database
      const admin = await this.authService.findAdminByEmail(email);

      if (!admin) {
        // Don't reveal if email exists or not for security
        res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
        return;
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Save reset token to database
      await this.authService.setResetToken(admin, resetToken, resetTokenExpiry);

      // Send reset email
      try {
        await this.emailService.sendPasswordResetEmail(email, resetToken);
        res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
      } catch (error) {
        // Clear reset token if email fails
        await this.authService.clearResetToken(admin);
        throw error;
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ message: 'Failed to process password reset request' });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token and new password are required' });
      }

      // Validate password strength
      if (!this.authService.validatePasswordStrength(newPassword)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
      }

      const admin = await this.authService.findAdminByResetToken(token);

      if (!admin) {
        return res.status(400).json({ message: 'Invalid reset token' });
      }

      // Check if token is expired
      if (admin.resetPasswordExpires && admin.resetPasswordExpires < new Date()) {
        return res.status(400).json({ message: 'Reset token has expired' });
      }

      // Update password
      await this.authService.updateAdminPassword(admin, newPassword);

      // Send confirmation email
      try {
        await this.emailService.sendPasswordChangedEmail(admin.email);
      } catch (error) {
        console.error('Failed to send password changed email:', error);
      }

      res.json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ message: 'Failed to reset password' });
    }
  };

  verifyResetToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({ message: 'Token is required' });
      }

      const admin = await this.authService.findAdminByResetToken(token);

      if (!admin) {
        return res.status(400).json({ message: 'Invalid reset token' });
      }

      // Check if token is expired
      if (admin.resetPasswordExpires && admin.resetPasswordExpires < new Date()) {
        return res.status(400).json({ message: 'Reset token has expired' });
      }

      res.json({ message: 'Token is valid' });
    } catch (error) {
      console.error('Verify reset token error:', error);
      res.status(500).json({ message: 'Failed to verify token' });
    }
  };

  verifyToken = async (req: Request, res: Response) => {
    try {
      res.json({
        valid: true,
        user: req.user
      });
    } catch (error) {
      console.error('Verify token error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  getAdminProfile = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      res.json({
        user: req.user
      });
    } catch (error) {
      console.error('Get admin profile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  private logLoginAttempt(email: string, ip: string, success: boolean, reason: string, userAgent: string, timestamp: Date) {
    console.log(`[${timestamp.toISOString()}] LOGIN ATTEMPT: email=${email} ip=${ip} success=${success} reason=${reason} ua="${userAgent}"`);
  }
}

// Create and export a singleton instance
export const authController = new AuthController(
  new AuthService(),
  new EmailService()
); 