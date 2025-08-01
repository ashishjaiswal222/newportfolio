import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import emailService from '../services/email.service';
import { Comment } from '../models/Comment';
import { Blog } from '../models/Blog';

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

// User Registration
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    const userRepo = AppDataSource.getRepository(User);
    
    // Check if user already exists
    const existingUser = await userRepo.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user
    const user = userRepo.create({
      email,
      name,
      password,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
      emailVerified: false
    });

    await userRepo.save(user);

    // Send verification email
    try {
      await emailService.sendVerificationEmail(user.email, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    res.status(201).json({ 
      message: 'User registered successfully. Please check your email to verify your account.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// User Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email } });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLoginAt = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await userRepo.save(user);

    // Generate tokens
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const accessToken = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: 'user' 
      },
      secret,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { id: user.id, type: 'refresh' },
      secret,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );

    // Store refresh token
    refreshTokens[user.id] = refreshToken;

    // Set secure cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        website: user.website,
        location: user.location,
        company: user.company,
        jobTitle: user.jobTitle,
        socialLinks: user.socialLinks,
        skills: user.skills,
        emailVerified: user.emailVerified,
        role: 'user'
      },
      token: accessToken,
      refreshToken: refreshToken
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

// Get Current User Profile
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: userId } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        website: user.website,
        location: user.location,
        company: user.company,
        jobTitle: user.jobTitle,
        socialLinks: user.socialLinks,
        skills: user.skills,
        emailVerified: user.emailVerified,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        lastSeenAt: user.lastSeenAt,
        loginCount: user.loginCount,
        likedBlogs: user.likedBlogs,
        bookmarkedBlogs: user.bookmarkedBlogs,
        likedProjects: user.likedProjects,
        bookmarkedProjects: user.bookmarkedProjects,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Failed to get user profile' });
  }
};

// Update User Profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || userRole !== 'user') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { name, bio, website, location, company, jobTitle, socialLinks, skills } = req.body;

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (website !== undefined) user.website = website;
    if (location !== undefined) user.location = location;
    if (company !== undefined) user.company = company;
    if (jobTitle !== undefined) user.jobTitle = jobTitle;
    if (socialLinks) user.socialLinks = socialLinks;
    if (skills) user.skills = skills;

    await userRepo.save(user);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        website: user.website,
        location: user.location,
        company: user.company,
        jobTitle: user.jobTitle,
        socialLinks: user.socialLinks,
        skills: user.skills,
        emailVerified: user.emailVerified,
        role: 'user'
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// Forgot Password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email } });

    if (!user) {
      // Don't reveal if user exists or not
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await userRepo.save(user);

    // Send reset email
    try {
      await emailService.sendPasswordResetEmail(user.email, resetToken);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
    }

    res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to process password reset request' });
  }
};

// Reset Password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ 
      where: { 
        passwordResetToken: token,
        passwordResetExpires: { $gt: new Date() } as any
      } 
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password
    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await userRepo.save(user);

    res.json({ message: 'Password reset successfully' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
};

// Verify Email
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ 
      where: { 
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: new Date() } as any
      } 
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    // Verify email
    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await userRepo.save(user);

    res.json({ message: 'Email verified successfully' });

  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ message: 'Failed to verify email' });
  }
};

// User Logout
export const logout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (userId && refreshTokens[userId]) {
      delete refreshTokens[userId];
    }

    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.json({ message: 'Logged out successfully' });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Failed to logout' });
  }
};

// Refresh Token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    const secret = process.env.JWT_SECRET || 'your-secret-key';
    
    try {
      const decoded = jwt.verify(token, secret) as any;
      
      if (decoded.type !== 'refresh') {
        return res.status(400).json({ message: 'Invalid token type' });
      }

      const storedToken = refreshTokens[decoded.id];
      if (!storedToken || storedToken !== token) {
        return res.status(400).json({ message: 'Invalid refresh token' });
      }

      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({ where: { id: decoded.id } });

      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      // Generate new tokens
      const newAccessToken = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          role: 'user' 
        },
        secret,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
      );

      const newRefreshToken = jwt.sign(
        { id: user.id, type: 'refresh' },
        secret,
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
      );

      // Update stored refresh token
      refreshTokens[user.id] = newRefreshToken;

      // Set new cookies
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({
        token: newAccessToken,
        refreshToken: newRefreshToken
      });

    } catch (jwtError) {
      return res.status(400).json({ message: 'Invalid refresh token' });
    }

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ message: 'Failed to refresh token' });
  }
}; 

// Get User Comments
export const getUserComments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const commentRepo = AppDataSource.getRepository(Comment);
    const blogRepo = AppDataSource.getRepository(Blog);

    const comments = await commentRepo.find({
      where: { authorId: userId },
      relations: ['author'],
      order: { createdAt: 'DESC' }
    });

    // Get blog titles for each comment
    const commentsWithBlogTitles = await Promise.all(
      comments.map(async (comment) => {
        const blog = await blogRepo.findOne({ where: { id: comment.blogId } });
        return {
          ...comment,
          blogTitle: blog?.title || 'Unknown Blog'
        };
      })
    );

    res.json({ comments: commentsWithBlogTitles });
  } catch (error) {
    console.error('Get user comments error:', error);
    res.status(500).json({ message: 'Failed to get user comments' });
  }
};

// Get User Activity
export const getUserActivity = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const userRepo = AppDataSource.getRepository(User);
    const commentRepo = AppDataSource.getRepository(Comment);
    const blogRepo = AppDataSource.getRepository(Blog);

    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const activity = [];

    // Get recent comments
    const recentComments = await commentRepo.find({
      where: { authorId: userId },
      relations: ['author'],
      order: { createdAt: 'DESC' },
      take: 10
    });

    for (const comment of recentComments) {
      const blog = await blogRepo.findOne({ where: { id: comment.blogId } });
      activity.push({
        type: 'comment',
        description: `Commented on "${blog?.title || 'Unknown Blog'}"`,
        timeAgo: getTimeAgo(comment.createdAt),
        createdAt: comment.createdAt,
        data: {
          commentId: comment.id,
          blogId: comment.blogId,
          blogTitle: blog?.title,
          content: comment.content.substring(0, 100) + (comment.content.length > 100 ? '...' : '')
        }
      });
    }

    // Get recent likes (from likedBlogs array)
    if (user.likedBlogs && user.likedBlogs.length > 0) {
      const recentLikedBlogs = await blogRepo.find({
        where: { id: { $in: user.likedBlogs.slice(-5) } as any },
        order: { updatedAt: 'DESC' }
      });

      for (const blog of recentLikedBlogs) {
        activity.push({
          type: 'like',
          description: `Liked "${blog.title}"`,
          timeAgo: getTimeAgo(blog.updatedAt),
          createdAt: blog.updatedAt,
          data: {
            blogId: blog.id,
            blogTitle: blog.title
          }
        });
      }
    }

    // Get recent bookmarks (from bookmarkedBlogs array)
    if (user.bookmarkedBlogs && user.bookmarkedBlogs.length > 0) {
      const recentBookmarkedBlogs = await blogRepo.find({
        where: { id: { $in: user.bookmarkedBlogs.slice(-5) } as any },
        order: { updatedAt: 'DESC' }
      });

      for (const blog of recentBookmarkedBlogs) {
        activity.push({
          type: 'bookmark',
          description: `Bookmarked "${blog.title}"`,
          timeAgo: getTimeAgo(blog.updatedAt),
          createdAt: blog.updatedAt,
          data: {
            blogId: blog.id,
            blogTitle: blog.title
          }
        });
      }
    }

    // Sort activity by date (most recent first)
    activity.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Limit to 20 most recent activities
    const limitedActivity = activity.slice(0, 20);

    res.json({ activity: limitedActivity });
  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({ message: 'Failed to get user activity' });
  }
};

// Helper function to get time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
} 