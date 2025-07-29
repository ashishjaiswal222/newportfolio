# 🚀 Ashish AI Portfolio Nexus

A modern, full-stack portfolio management system built with React, TypeScript, Node.js, and PostgreSQL. Features a cyberpunk-themed admin dashboard with comprehensive analytics, project management, and content management capabilities.

## ✨ Features

### 🎨 Frontend (React + TypeScript + Vite)
- **Modern UI/UX**: Cyberpunk-themed design with smooth animations
- **Responsive Design**: Fully responsive across all devices
- **Component Library**: Built with shadcn/ui components
- **State Management**: React Query for server state management
- **Routing**: React Router for seamless navigation
- **Charts & Analytics**: Chart.js integration for data visualization
- **Form Handling**: React Hook Form with Zod validation
- **Real-time Updates**: Live data updates and notifications

### 🔧 Backend (Node.js + Express + TypeScript)
- **RESTful API**: Comprehensive API endpoints
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT-based authentication system
- **Security**: Rate limiting, CORS, Helmet.js
- **Email Service**: Nodemailer integration
- **File Upload**: Multer for file handling
- **Validation**: Zod schema validation
- **Logging**: Winston logger

### 📊 Admin Dashboard Features
- **Project Management**: CRUD operations for portfolio projects
- **Analytics Dashboard**: Comprehensive analytics with charts
- **Testimonial Management**: Client feedback system
- **Contact Management**: Incoming message handling
- **Blog Management**: Content management system
- **User Management**: Admin profile and settings
- **Real-time Statistics**: Live data updates

### 🎯 Portfolio Features
- **Project Showcase**: Interactive project cards with ratings
- **Skills Section**: Dynamic skills display
- **Experience Timeline**: Professional experience showcase
- **Testimonials**: Client testimonials with approval system
- **Contact Form**: Integrated contact system
- **Blog Section**: Content management
- **Responsive Design**: Mobile-first approach

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Framer Motion** - Animations
- **React Query** - Data fetching
- **Chart.js** - Data visualization
- **React Router** - Routing
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **TypeORM** - ORM
- **JWT** - Authentication
- **Nodemailer** - Email service
- **Multer** - File upload
- **Winston** - Logging
- **Helmet.js** - Security
- **CORS** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0
- PostgreSQL >= 12.0
- Git

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/ashishjaiswal222/newportfolio.git
cd newportfolio

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure database
# Update .env with your PostgreSQL credentials

# Run database migrations
npm run migration:run

# Seed initial data
npm run db:seed

# Create admin user
npm run init-admin

# Start development server
npm run dev
```

## 🔧 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Ashish AI Portfolio
```

### Backend (.env)
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=portfolio_db

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
COMPANY_EMAIL=your_company_email@gmail.com
COMPANY_EMAIL_PASSWORD=your_company_app_password

# Security
CORS_ORIGIN=http://localhost:8080
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod
```

### Backend Deployment (Railway/Render)
```bash
# Build for production
cd backend
npm run build

# Deploy to Railway
railway up

# Or deploy to Render
# Connect your GitHub repository to Render
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build individual containers
docker build -t portfolio-frontend .
docker build -t portfolio-backend ./backend
```

## 📁 Project Structure

```
ashish-ai-portfolio-nexus/
├── src/
│   ├── components/
│   │   ├── admin/           # Admin dashboard components
│   │   ├── analytics/       # Analytics and charts
│   │   ├── auth/           # Authentication components
│   │   ├── blog/           # Blog management
│   │   ├── editor/         # Rich text editor
│   │   ├── effects/        # Visual effects
│   │   ├── portfolio/      # Portfolio sections
│   │   └── ui/             # Reusable UI components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── pages/              # Page components
│   ├── services/           # API services
│   └── main.tsx           # App entry point
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # TypeORM entities
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── server.ts       # Server entry point
│   ├── migrations/         # Database migrations
│   └── scripts/            # Utility scripts
├── public/                 # Static assets
└── dist/                   # Build output
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/refresh` - Refresh token

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/featured` - Get featured projects
- `POST /api/projects/:id/rate` - Rate project

### Testimonials
- `GET /api/testimonials` - Get all testimonials
- `POST /api/testimonials` - Create testimonial
- `PUT /api/testimonials/:id/status` - Update testimonial status
- `DELETE /api/testimonials/:id` - Delete testimonial

### Contacts
- `GET /api/contacts` - Get all contacts
- `POST /api/contacts` - Create contact
- `PUT /api/contacts/:id/status` - Update contact status
- `DELETE /api/contacts/:id` - Delete contact

### Analytics
- `GET /api/projects/analytics/summary` - Get project analytics
- `GET /api/analytics/overview` - Get dashboard overview

## 🧪 Testing

### Frontend Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Backend Testing
```bash
cd backend

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ashish Jaiswal**
- GitHub: [@ashishjaiswal222](https://github.com/ashishjaiswal222)
- LinkedIn: [Ashish Jaiswal](https://linkedin.com/in/ashishjaiswal222)

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the component library
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Chart.js](https://www.chartjs.org/) for data visualization
- [TypeORM](https://typeorm.io/) for database management
- [Framer Motion](https://www.framer.com/motion/) for animations

## 🐛 Issues

If you encounter any issues, please [open an issue](https://github.com/ashishjaiswal222/newportfolio/issues) on GitHub.

## 📞 Support

For support, email support@ashishjaiswal.com or join our Slack channel.

---

⭐ **Star this repository if you found it helpful!**
