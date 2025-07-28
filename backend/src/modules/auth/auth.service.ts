import { AppDataSource } from '../../config/ormconfig';
import { AdminUser } from '../../models/AdminUser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ADMIN_LOGIN_USERNAME, ADMIN_LOGIN_PASSWORD, JWT_SECRET } from '../../config/config';

export interface AdminUserData {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

export class AuthService {
  private adminRepo = AppDataSource.getRepository(AdminUser);

  async validateCredentials(email: string, password: string): Promise<boolean> {
    if (!ADMIN_LOGIN_USERNAME || !ADMIN_LOGIN_PASSWORD) {
      throw new Error('Admin credentials not configured');
    }

    return email === ADMIN_LOGIN_USERNAME && password === ADMIN_LOGIN_PASSWORD;
  }

  async getOrCreateAdminUser(email: string, password: string): Promise<AdminUser> {
    let admin = await this.adminRepo.findOne({ where: { email } });

    if (!admin) {
      // Create admin user if doesn't exist
      const hashedPassword = await bcrypt.hash(password, 12);
      admin = this.adminRepo.create({
        email,
        name: 'Admin User',
        password: hashedPassword,
        isActive: true
      });
    } else {
      // Update last login
      admin.lastLoginAt = new Date();
    }

    return await this.adminRepo.save(admin);
  }

  generateTokens(user: AdminUser): AuthTokens {
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  async verifyToken(token: string): Promise<JWTPayload> {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as JWTPayload;
      
      return jwt.sign(
        { id: decoded.id, email: decoded.email, name: decoded.name },
        JWT_SECRET,
        { expiresIn: '15m' }
      );
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async findAdminByEmail(email: string): Promise<AdminUser | null> {
    return await this.adminRepo.findOne({ where: { email } });
  }

  async findAdminByResetToken(token: string): Promise<AdminUser | null> {
    return await this.adminRepo.findOne({
      where: { resetPasswordToken: token }
    });
  }

  async updateAdminPassword(admin: AdminUser, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    admin.password = hashedPassword;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await this.adminRepo.save(admin);
  }

  async setResetToken(admin: AdminUser, token: string, expiresAt: Date): Promise<void> {
    admin.resetPasswordToken = token;
    admin.resetPasswordExpires = expiresAt;
    await this.adminRepo.save(admin);
  }

  async clearResetToken(admin: AdminUser): Promise<void> {
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await this.adminRepo.save(admin);
  }

  validatePasswordStrength(password: string): boolean {
    return password.length >= 8;
  }

  sanitizeAdminUser(admin: AdminUser): AdminUserData {
    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      isActive: admin.isActive,
      lastLoginAt: admin.lastLoginAt,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
    };
  }
}

// Export singleton instance
export const authService = new AuthService(); 