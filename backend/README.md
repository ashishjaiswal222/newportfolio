# Production-Ready Backend API

A modular, scalable Node.js backend built with Express, TypeScript, and PostgreSQL. Designed for easy reuse across different projects.

## 🚀 Features

- **Modular Architecture**: Each feature (auth, blog, contact, etc.) is a separate module
- **Production Ready**: Docker support, health checks, logging, error handling
- **Security**: JWT authentication, rate limiting, input validation
- **Email Service**: Password reset, notifications
- **Database**: PostgreSQL with TypeORM
- **API Documentation**: OpenAPI/Swagger ready

## 📁 Project Structure

```
backend/
├── src/
│   ├── modules/           # Feature modules
│   │   ├── auth/         # Authentication module
│   │   ├── blog/         # Blog module
│   │   ├── contact/      # Contact module
│   │   ├── testimonial/  # Testimonial module
│   │   ├── project/      # Project module
│   │   ├── analytics/    # Analytics module
│   │   └── admin/        # Admin module
│   ├── config/           # Configuration
│   ├── models/           # Database models
│   ├── middleware/       # Global middleware
│   ├── utils/            # Utility functions
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── Dockerfile           # Production Docker image
├── docker-compose.yml   # Development environment
├── .env.example         # Environment variables template
└── README.md           # This file
```

## 🛠️ Installation

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Setup

1. **Clone and install dependencies**
   ```bash
   git clone <repository>
   cd backend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**
   ```bash
   # Create database
   createdb your_database_name
   
   # Run migrations (if using TypeORM migrations)
   npm run migration:run
   
   # Initialize admin user
   npm run init-admin
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=your_database

# JWT
JWT_SECRET=your_jwt_secret_key

# Admin
ADMIN_LOGIN_USERNAME=admin@example.com
ADMIN_LOGIN_PASSWORD=secure_password

# Email (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
COMPANY_EMAIL=your_email@gmail.com
COMPANY_EMAIL_PASSWORD=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 🚀 Usage

### Development

```bash
npm run dev          # Start with hot reload
npm run build        # Build TypeScript
npm run start        # Start production server
npm run test         # Run tests
```

### Production

```bash
# Using Docker
docker build -t backend .
docker run -p 3000:3000 backend

# Using Docker Compose
docker-compose up -d
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/profile` - Get admin profile
- `POST /api/auth/refresh` - Refresh access token

### Public Endpoints

- `GET /api/health` - Health check
- `GET /api/testimonials` - Get testimonials
- `POST /api/contacts` - Submit contact form
- `GET /api/projects` - Get projects
- `GET /api/blogs` - Get blog posts

### Protected Endpoints (Admin)

- `GET /api/admin/testimonials` - Admin testimonials management
- `GET /api/admin/contacts` - Admin contacts management
- `GET /api/admin/analytics` - Analytics data

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Zod schema validation
- **CORS Protection**: Configurable CORS settings
- **Password Hashing**: bcrypt for password security
- **SQL Injection Protection**: TypeORM parameterized queries

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test
npm test -- --grep "auth"

# Test API endpoints
node test_admin_system.js
```

## 📦 Module System

### Using Modules in Other Projects

Each module is self-contained and can be easily reused:

```typescript
// Import specific modules
import { authModule } from './modules/auth';
import { blogModule } from './modules/blog';

// Use in your app
app.use('/api/auth', authModule);
app.use('/api/blog', blogModule);
```

### Creating New Modules

1. Create module directory: `src/modules/your-module/`
2. Add controller, service, routes, middleware
3. Export from `src/modules/index.ts`
4. Register in main app

## 🐳 Docker

### Development

```bash
docker-compose up -d
```

### Production

```bash
# Build image
docker build -t backend .

# Run container
docker run -d \
  --name backend \
  -p 3000:3000 \
  --env-file .env \
  backend
```

## 📊 Monitoring

### Health Check

```bash
curl http://localhost:3000/api/health
```

### Logs

```bash
# View logs
docker logs backend

# Follow logs
docker logs -f backend
```

## 🔧 Customization

### Adding New Features

1. Create new module in `src/modules/`
2. Add database models in `src/models/`
3. Update environment variables
4. Add tests
5. Update documentation

### Database Changes

1. Create migration: `npm run migration:create -- -n MigrationName`
2. Run migration: `npm run migration:run`
3. Revert if needed: `npm run migration:revert`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Make changes and test
4. Commit: `git commit -m 'Add feature'`
5. Push: `git push origin feature-name`
6. Create Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@example.com or create an issue in the repository.
