# 🚀 Deployment Guide

This guide covers deployment options for both frontend and backend components of the Ashish AI Portfolio Nexus.

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- PostgreSQL database
- Git repository access

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add: `VITE_API_URL=https://your-backend-url.com`

3. **Deploy**
   ```bash
   # Deploy to Vercel
   vercel --prod
   ```

### Option 2: Netlify

1. **Connect Repository**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`

2. **Configure Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add: `VITE_API_URL=https://your-backend-url.com`

3. **Deploy**
   - Netlify will automatically deploy on push to main branch

### Option 3: GitHub Pages

1. **Update vite.config.ts**
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... other config
   })
   ```

2. **Add GitHub Action**
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [ main ]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm ci
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

## 🔧 Backend Deployment

### Option 1: Railway (Recommended)

1. **Connect Repository**
   - Connect your GitHub repository to Railway
   - Set root directory to `backend`

2. **Configure Environment Variables**
   - Add all required environment variables in Railway dashboard
   - Set `NODE_ENV=production`

3. **Deploy**
   - Railway will automatically deploy on push to main branch

### Option 2: Render

1. **Create New Web Service**
   - Connect your GitHub repository
   - Set root directory to `backend`
   - Build command: `npm install && npm run build`
   - Start command: `npm start`

2. **Configure Environment Variables**
   - Add all required environment variables
   - Set `NODE_ENV=production`

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   cd backend
   heroku create your-app-name
   ```

3. **Configure Database**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_secret
   # Add other environment variables
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 4: DigitalOcean App Platform

1. **Create App**
   - Connect your GitHub repository
   - Set source directory to `backend`
   - Build command: `npm install && npm run build`
   - Run command: `npm start`

2. **Configure Environment Variables**
   - Add all required environment variables
   - Set `NODE_ENV=production`

## 🐳 Docker Deployment

### Docker Compose (Full Stack)

1. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     frontend:
       build: .
       ports:
         - "8080:80"
       environment:
         - VITE_API_URL=http://localhost:3000
       depends_on:
         - backend
     
     backend:
       build: ./backend
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
         - DB_HOST=postgres
         - DB_PORT=5432
         - DB_USERNAME=postgres
         - DB_PASSWORD=password
         - DB_DATABASE=portfolio
       depends_on:
         - postgres
     
     postgres:
       image: postgres:15
       environment:
         - POSTGRES_USER=postgres
         - POSTGRES_PASSWORD=password
         - POSTGRES_DB=portfolio
       volumes:
         - postgres_data:/var/lib/postgresql/data
       ports:
         - "5432:5432"
   
   volumes:
     postgres_data:
   ```

2. **Deploy**
   ```bash
   docker-compose up -d
   ```

### Individual Containers

1. **Frontend Dockerfile**
   ```dockerfile
   FROM node:18-alpine as builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Backend Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

## 🗄️ Database Setup

### PostgreSQL Setup

1. **Local Development**
   ```bash
   # Install PostgreSQL
   # Create database
   createdb portfolio_db
   
   # Run migrations
   cd backend
   npm run migration:run
   
   # Seed data
   npm run db:seed
   ```

2. **Production Database**
   - Use managed PostgreSQL service (Railway, Supabase, etc.)
   - Set up connection pooling
   - Configure backups
   - Set up monitoring

### Environment Variables for Database

```env
DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_DATABASE=your-database
```

## 🔒 Security Configuration

### SSL/HTTPS
- Enable SSL certificates (Let's Encrypt)
- Configure HTTPS redirects
- Set secure headers

### Environment Variables
```env
NODE_ENV=production
JWT_SECRET=your-super-secure-secret
JWT_REFRESH_SECRET=your-super-secure-refresh-secret
CORS_ORIGIN=https://your-frontend-domain.com
```

### Rate Limiting
```env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

## 📊 Monitoring & Logging

### Application Monitoring
- Set up error tracking (Sentry)
- Configure performance monitoring
- Set up uptime monitoring

### Database Monitoring
- Set up query performance monitoring
- Configure slow query alerts
- Monitor connection pool usage

### Logging
```env
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy
on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: |
          cd backend
          npm ci
          npm run build
      - uses: railway/action@v1
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Database Connection Issues**
   - Verify database credentials
   - Check network connectivity
   - Ensure database is running

3. **Environment Variables**
   - Verify all required variables are set
   - Check variable names and values
   - Restart application after changes

4. **CORS Issues**
   - Verify CORS_ORIGIN is set correctly
   - Check frontend URL matches backend configuration

### Performance Optimization

1. **Frontend**
   - Enable code splitting
   - Optimize images
   - Use CDN for static assets

2. **Backend**
   - Enable compression
   - Use connection pooling
   - Implement caching

3. **Database**
   - Add indexes for frequently queried columns
   - Optimize queries
   - Use read replicas if needed

## 📞 Support

For deployment issues:
- Check the troubleshooting section
- Review logs for error messages
- Contact support with specific error details

---

**Happy Deploying! 🚀** 