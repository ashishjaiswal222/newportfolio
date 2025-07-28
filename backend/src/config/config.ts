import dotenv from 'dotenv';
dotenv.config(); // Load .env before anything else

// Validate required environment variables
const requiredEnvVars = {
  ADMIN_LOGIN_USERNAME: process.env.ADMIN_LOGIN_USERNAME,
  ADMIN_LOGIN_PASSWORD: process.env.ADMIN_LOGIN_PASSWORD,
  JWT_SECRET: process.env.JWT_SECRET,
};

// Check if any required env vars are missing
for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

// Export validated environment variables
export const ADMIN_LOGIN_USERNAME = requiredEnvVars.ADMIN_LOGIN_USERNAME as string;
export const ADMIN_LOGIN_PASSWORD = requiredEnvVars.ADMIN_LOGIN_PASSWORD as string;
export const JWT_SECRET = requiredEnvVars.JWT_SECRET as string;

// Email configuration for password reset
export const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
export const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
export const EMAIL_USER = process.env.COMPANY_EMAIL || '';
export const EMAIL_PASS = process.env.COMPANY_EMAIL_PASSWORD || '';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8084'; 