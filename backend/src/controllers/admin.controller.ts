import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { AdminUser } from '../models/AdminUser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import emailService from '../services/email.service';
import { User } from '../models/User'; // Added missing import for User model
import crypto from 'crypto'; // Added missing import for crypto

const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

// Simple in-memory refresh token store for demo (replace with DB in prod)
const refreshTokens: Record<string, string> = {};

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
  };
}

// Admin Login
export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const adminUsername = process.env.ADMIN_LOGIN_USERNAME;
    const adminPassword = process.env.ADMIN_LOGIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      console.error('Admin credentials not configured in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    if (email !== adminUsername || password !== adminPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const adminRepo = AppDataSource.getRepository(AdminUser);
    let admin = await adminRepo.findOne({ where: { email } });

    if (!admin) {
      const hashedPassword = await bcrypt.hash(password, 12);
      admin = adminRepo.create({
        email,
        name: 'Ashish Jaiswal',
        password: hashedPassword,
        isActive: true
      });
      await adminRepo.save(admin);
    } else {
      admin.lastLoginAt = new Date();
      await adminRepo.save(admin);
    }

    const accessToken = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name, role: 'admin' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name, role: 'admin' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );

    refreshTokens[admin.id] = refreshToken;

    res.json({
      message: 'Admin login successful',
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: 'admin'
      },
      token: accessToken,
      refreshToken: refreshToken
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Admin login failed' });
  }
};

// Get Admin Profile
export const getAdminProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || userRole !== 'admin') {
      return res.status(401).json({ message: 'Not authenticated as admin' });
    }

    const adminRepo = AppDataSource.getRepository(AdminUser);
    const admin = await adminRepo.findOne({ where: { id: userId } });
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    return res.json({
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({ message: 'Failed to get admin profile' });
  }
};

// Update Admin Profile
export const updateAdminProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || userRole !== 'admin') {
      return res.status(401).json({ message: 'Not authorized as admin' });
    }

    const { name, email } = req.body;

    const adminRepo = AppDataSource.getRepository(AdminUser);
    const admin = await adminRepo.findOne({ where: { id: userId } });

    if (!admin) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    // Update fields
    if (name) admin.name = name;
    if (email) admin.email = email;

    await adminRepo.save(admin);

    res.json({
      message: 'Admin profile updated successfully',
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({ message: 'Failed to update admin profile' });
  }
};

// Admin Forgot Password
export const adminForgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const adminUsername = process.env.ADMIN_LOGIN_USERNAME;
    if (email !== adminUsername) {
      return res.status(404).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    const adminRepo = AppDataSource.getRepository(AdminUser);
    const admin = await adminRepo.findOne({ where: { email } });

    if (!admin) {
      return res.status(404).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    admin.resetPasswordToken = resetToken;
    admin.resetPasswordExpires = resetExpires;
    await adminRepo.save(admin);

    try {
      await emailService.sendPasswordResetEmail(admin.email, resetToken);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
    }

    res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });

  } catch (error) {
    console.error('Admin forgot password error:', error);
    res.status(500).json({ message: 'Failed to process password reset' });
  }
};

// Admin Reset Password
export const adminResetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    const adminRepo = AppDataSource.getRepository(AdminUser);
    const admin = await adminRepo.findOne({ 
      where: { 
        resetPasswordToken: token
      }
    });

    if (!admin || !admin.resetPasswordExpires || admin.resetPasswordExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    admin.password = password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await adminRepo.save(admin);

    // Send confirmation email
    try {
      await emailService.sendPasswordChangedEmail(admin.email);
    } catch (emailError) {
      console.error('Failed to send password changed email:', emailError);
    }

    res.json({ message: 'Password reset successfully' });

  } catch (error) {
    console.error('Admin reset password error:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
};

// Admin Logout
export const adminLogout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (userId && refreshTokens[userId]) {
      delete refreshTokens[userId];
    }

    res.json({ message: 'Admin logout successful' });
  } catch (error) {
    console.error('Admin logout error:', error);
    res.status(500).json({ message: 'Admin logout failed' });
  }
};

// Get All Users (Admin only)
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const userRole = req.user?.role;

    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const userRepo = AppDataSource.getRepository(User);
    const users = await userRepo.find({
      select: ['id', 'email', 'name', 'emailVerified', 'isActive', 'lastLoginAt', 'createdAt']
    });

    res.json({ users });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Failed to get users' });
  }
};

// Get User by ID (Admin only)
export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const userRole = req.user?.role;
    const { id } = req.params;

    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });

  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Failed to get user' });
  }
};

// Update User Status (Admin only)
export const updateUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userRole = req.user?.role;
    const { id } = req.params;
    const { isActive } = req.body;

    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = isActive;
    await userRepo.save(user);

    res.json({ 
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Failed to update user status' });
  }
}; 