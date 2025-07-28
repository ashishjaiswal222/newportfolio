const dotenv = require('dotenv');
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
exports.ADMIN_LOGIN_USERNAME = requiredEnvVars.ADMIN_LOGIN_USERNAME;
exports.ADMIN_LOGIN_PASSWORD = requiredEnvVars.ADMIN_LOGIN_PASSWORD;
exports.JWT_SECRET = requiredEnvVars.JWT_SECRET;

// Email configuration for password reset
exports.EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
exports.EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
exports.EMAIL_USER = process.env.COMPANY_EMAIL || '';
exports.EMAIL_PASS = process.env.COMPANY_EMAIL_PASSWORD || '';
exports.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8084'; 