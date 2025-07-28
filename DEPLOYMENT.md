# Admin Authentication System - Deployment Guide

## 🚀 Complete Admin Authentication System

This guide covers the deployment of the enhanced admin authentication system with password reset functionality.

## 📋 System Overview

### Features Implemented:
- ✅ **Secure Admin Login** with email/password
- ✅ **HttpOnly Cookie-based JWT Authentication**
- ✅ **Password Reset via Email**
- ✅ **Rate Limiting & Brute Force Protection**
- ✅ **Audit Logging for Login Attempts**
- ✅ **Strong Password Policy**
- ✅ **Session Management with Auto-refresh**
- ✅ **Protected Admin Routes**

### Admin Credentials:
- **Email**: `ashishjaiswal0701@gmail.com`
- **Password**: `@fusu649Ib`

## 🛠️ Backend Setup

### 1. Environment Configuration

Create a `.env` file in the `backend/` directory:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=portfolio_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Admin Credentials
ADMIN_LOGIN_USERNAME=ashishjaiswal0701@gmail.com
ADMIN_LOGIN_PASSWORD=@fusu649Ib

# Email Configuration (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:5173

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 2. Email Setup (for password reset)

#### Gmail Setup:
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `EMAIL_PASS`

#### Other Email Providers:
- Update `EMAIL_HOST` and `EMAIL_PORT` accordingly
- Use appropriate credentials

### 3. Database Setup

#### PostgreSQL:
```sql
-- Create database
CREATE DATABASE portfolio_db;

-- The tables will be created automatically by TypeORM
```

### 4. Install Dependencies

```bash
cd backend
npm install
```

### 5. Start Backend Server

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 🎨 Frontend Setup

### 1. Environment Configuration

Create a `.env` file in the root directory:

```bash
VITE_API_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Frontend Server

```bash
npm run dev
```

## 🔐 Authentication Flow

### 1. Admin Login
```
POST /api/auth/login
Body: { email: "ashishjaiswal0701@gmail.com", password: "@fusu649Ib" }
Response: Sets HttpOnly cookies (accessToken, refreshToken)
```

### 2. Password Reset Flow
```
1. User clicks "Forgot Password" on login page
2. POST /api/auth/forgot-password with email
3. System generates reset token and sends email
4. User clicks link in email → /admin/reset-password?token=xxx
5. POST /api/auth/reset-password with token and new password
```

### 3. Protected Routes
```
All admin routes (/admin/*) are protected by:
- authenticateToken middleware (checks JWT in cookies)
- requireAdmin middleware (verifies admin role)
```

## 🚀 Production Deployment

### 1. Environment Variables (Production)

```bash
# Update these for production
NODE_ENV=production
JWT_SECRET=very-long-random-secret-key
FRONTEND_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com
EMAIL_HOST=smtp.yourprovider.com
EMAIL_USER=admin@yourdomain.com
EMAIL_PASS=your-email-password
```

### 2. Database (Production)

```bash
# Use a production PostgreSQL instance
# Consider using managed services like:
# - AWS RDS
# - Google Cloud SQL
# - DigitalOcean Managed Databases
# - Railway
# - Supabase
```

### 3. Email Service (Production)

```bash
# Recommended email services:
# - SendGrid
# - Mailgun
# - AWS SES
# - Resend
# - Postmark
```

### 4. Deployment Platforms

#### Backend Deployment:
- **Railway**: Easy deployment with PostgreSQL
- **Render**: Free tier available
- **Heroku**: Classic choice
- **DigitalOcean App Platform**
- **AWS Elastic Beanstalk**

#### Frontend Deployment:
- **Vercel**: Optimized for React
- **Netlify**: Great for static sites
- **GitHub Pages**: Free hosting
- **AWS S3 + CloudFront**

### 5. Security Checklist

- [ ] Change default JWT secret
- [ ] Use HTTPS in production
- [ ] Set secure cookie options
- [ ] Configure proper CORS origins
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Set up monitoring/logging
- [ ] Regular security updates

## 🧪 Testing the System

### 1. Test Admin Login
```bash
# Test login endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ashishjaiswal0701@gmail.com","password":"@fusu649Ib"}'
```

### 2. Test Password Reset
```bash
# Test forgot password
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"ashishjaiswal0701@gmail.com"}'
```

### 3. Test Protected Routes
```bash
# Should return 401 without authentication
curl http://localhost:3000/api/admin/contacts
```

## 🔧 Troubleshooting

### Common Issues:

1. **TypeScript Compilation Errors**
   - Ensure `experimentalDecorators` and `emitDecoratorMetadata` are enabled in `tsconfig.json`
   - Check that all dependencies are installed

2. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database exists

3. **Email Not Sending**
   - Verify email credentials
   - Check if 2FA is enabled for Gmail
   - Use App Password instead of regular password

4. **CORS Errors**
   - Check `CORS_ORIGIN` in backend `.env`
   - Ensure frontend URL matches

5. **JWT Token Issues**
   - Verify `JWT_SECRET` is set
   - Check cookie settings
   - Ensure `withCredentials: true` in frontend API calls

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check server logs for detailed error messages

## 🎯 Next Steps

After successful deployment:
1. Set up monitoring and logging
2. Configure backup strategies
3. Set up CI/CD pipelines
4. Implement additional security measures
5. Add user activity tracking
6. Set up automated testing

---

**Note**: This system is production-ready but should be customized based on your specific security requirements and deployment environment. 