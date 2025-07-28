const { AppDataSource } = require('../config/ormconfig');
const { AdminUser } = require('../models/AdminUser');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const emailService = require('../services/email.service');

const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

// Simple in-memory refresh token store for demo (replace with DB in prod)
const refreshTokens = {};

// Simple audit log (replace with DB in prod)
function logLoginAttempt(email, ip, success, reason, userAgent, timestamp) {
  console.log(`[${timestamp.toISOString()}] LOGIN ATTEMPT: email=${email} ip=${ip} success=${success} reason=${reason} ua="${userAgent}"`);
}

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip;
    const userAgent = req.headers['user-agent'] || '';
    const timestamp = new Date();

    if (!email || !password) {
      logLoginAttempt(email, ip, false, 'Missing credentials', userAgent, timestamp);
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Direct environment variable access
    const adminUsername = process.env.ADMIN_LOGIN_USERNAME;
    const adminPassword = process.env.ADMIN_LOGIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminUsername || !adminPassword || !jwtSecret) {
      console.error('Missing required environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    if (email !== adminUsername || password !== adminPassword.trim()) {
      logLoginAttempt(email, ip, false, 'Invalid credentials', userAgent, timestamp);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Sync DB with .env if needed
    const adminRepo = AppDataSource.getRepository(AdminUser);
    let admin = await adminRepo.findOne({ where: { email: adminUsername } });
    if (!admin) {
      admin = adminRepo.create({
        email: adminUsername,
        name: 'Admin',
        password: adminPassword,
        isActive: true,
      });
      await adminRepo.save(admin);
    } else {
      // Update password in DB if changed in .env
      if (admin.password !== adminPassword) {
        admin.password = adminPassword;
        await adminRepo.save(admin);
      }
    }
    if (!admin.isActive) {
      logLoginAttempt(email, ip, false, 'Account deactivated', userAgent, timestamp);
      return res.status(401).json({ message: 'Account is deactivated' });
    }
    // Update last login
    admin.lastLoginAt = new Date();
    await adminRepo.save(admin);
    // Generate JWT tokens
    const accessToken = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        name: admin.name
      },
      jwtSecret,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );
    const refreshToken = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        name: admin.name
      },
      jwtSecret,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );
    refreshTokens[admin.id] = refreshToken;
    // Set cookies
    res.cookie('accessToken', accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });
    logLoginAttempt(email, ip, true, 'Login successful', userAgent, timestamp);
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
    res.status(500).json({ message: 'Login failed' });
  }
};

const adminLogout = async (req, res) => {
  try {
    if (req.user && req.user.id) {
      delete refreshTokens[req.user.id];
    }
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: 'Refresh token required' });
    }
    let decoded;
    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return res.status(500).json({ message: 'Server configuration error' });
      }
      decoded = jwt.verify(token, jwtSecret);
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

const forgotPassword = async (req, res) => {
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

const resetPassword = async (req, res) => {
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
    const bcrypt = require('bcryptjs');
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

const verifyResetToken = async (req, res) => {
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

const verifyToken = async (req, res) => {
  try {
    res.json({
      valid: true,
      user: req.user
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Token verification failed' });
  }
};

const getAdminProfile = async (req, res) => {
  try {
    const adminRepo = AppDataSource.getRepository(AdminUser);
    const admin = await adminRepo.findOne({
      where: { id: req.user?.id },
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

module.exports = {
  adminLogin,
  adminLogout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  verifyToken,
  getAdminProfile
}; 