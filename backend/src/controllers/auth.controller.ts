import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { AdminUser } from '../models/AdminUser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import emailService from '../services/email.service';

const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

// Simple in-memory refresh token store for demo (replace with DB in prod)
const refreshTokens: Record<string, string> = {};

// Fallback for TS2339 if global type is not picked up
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

interface JWTPayload {
  id: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check against environment variables
    const adminUsername = process.env.ADMIN_LOGIN_USERNAME;
    const adminPassword = process.env.ADMIN_LOGIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      console.error('Admin credentials not configured in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Validate credentials
    if (email !== adminUsername || password !== adminPassword) {
      // Log failed attempt
      logLoginAttempt(email, req.ip || 'unknown', false, 'Invalid credentials', req.get('User-Agent') || 'unknown', new Date());
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Get or create admin user in database
    const adminRepo = AppDataSource.getRepository(AdminUser);
    let admin = await adminRepo.findOne({ where: { email } });

    if (!admin) {
      // Create admin user if doesn't exist
      const hashedPassword = await bcrypt.hash(password, 12);
      admin = adminRepo.create({
        email,
        name: 'Ashish Jaiswal',
        password: hashedPassword,
        isActive: true
      });
      await adminRepo.save(admin);
    } else {
      // Update last login
      admin.lastLoginAt = new Date();
      await adminRepo.save(admin);
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );

    // Store refresh token (in production, use Redis or database)
    refreshTokens[admin.id] = refreshToken;

    // Log successful login
    logLoginAttempt(email, req.ip || 'unknown', true, 'Login successful', req.get('User-Agent') || 'unknown', new Date());

    // Return tokens in response body instead of cookies
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

export const adminLogout = async (req: Request, res: Response) => {
  try {
    const r = req as AuthRequest; // Type assertion
    if (r.user && r.user.id) {
      delete refreshTokens[r.user.id];
    }
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: 'Refresh token required' });
    }
    let decoded: JWTPayload;
    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return res.status(500).json({ message: 'Server configuration error' });
      }
      decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    } catch (err) {
      return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
    // Check if refresh token is valid
    if (!refreshTokens[decoded.id] || refreshTokens[decoded.id] !== token) {
      return res.status(403).json({ message: 'Refresh token invalidated' });
    }
    // Issue new access token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: 'Server configuration error' });
    }
    const accessToken = jwt.sign(
      {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name
      },
      jwtSecret,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );
    res.cookie('accessToken', accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
    res.json({ message: 'Token refreshed' });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ message: 'Token refresh failed' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const adminUsername = process.env.ADMIN_LOGIN_USERNAME;
    if (!adminUsername) {
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Check if email matches admin email
    if (email !== adminUsername) {
      return res.status(404).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    const adminRepo = AppDataSource.getRepository(AdminUser);
    const admin = await adminRepo.findOne({ where: { email } });

    if (!admin) {
      return res.status(404).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save reset token to database
    admin.resetPasswordToken = resetToken;
    admin.resetPasswordExpires = resetTokenExpiry;
    await adminRepo.save(admin);

    // Send reset email
    try {
      await emailService.sendPasswordResetEmail(email, resetToken);
      res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    } catch (error) {
      // Clear reset token if email fails
      admin.resetPasswordToken = undefined;
      admin.resetPasswordExpires = undefined;
      await adminRepo.save(admin);
      throw error;
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to process password reset request' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const adminRepo = AppDataSource.getRepository(AdminUser);
    const admin = await adminRepo.findOne({
      where: {
        resetPasswordToken: token
      }
    });

    if (!admin) {
      return res.status(400).json({ message: 'Invalid reset token' });
    }

    // Check if token is expired
    if (admin.resetPasswordExpires && admin.resetPasswordExpires < new Date()) {
      return res.status(400).json({ message: 'Reset token has expired' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update password
    admin.password = hashedPassword;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await adminRepo.save(admin);

    // Send confirmation email
    try {
      await emailService.sendPasswordChangedEmail(admin.email);
    } catch (error) {
      console.error('Failed to send password changed email:', error);
    }

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
};

export const verifyResetToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const adminRepo = AppDataSource.getRepository(AdminUser);
    const admin = await adminRepo.findOne({
      where: {
        resetPasswordToken: token
      }
    });

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

// Simple audit log (replace with DB in prod)
function logLoginAttempt(email: string, ip: string, success: boolean, reason: string, userAgent: string, timestamp: Date) {
  // In production, write to DB or file
  console.log(`[${timestamp.toISOString()}] LOGIN ATTEMPT: email=${email} ip=${ip} success=${success} reason=${reason} ua="${userAgent}"`);
}

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const r = req as AuthRequest; // Type assertion
    res.json({
      valid: true,
      user: r.user
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Token verification failed' });
  }
};

export const getAdminProfile = async (req: Request, res: Response) => {
  try {
    const r = req as AuthRequest; // Type assertion
    const adminRepo = AppDataSource.getRepository(AdminUser);
    const admin = await adminRepo.findOne({
      where: { id: r.user?.id },
      select: ['id', 'email', 'name', 'isActive', 'lastLoginAt', 'createdAt']
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({ admin });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to get profile' });
  }
}; 