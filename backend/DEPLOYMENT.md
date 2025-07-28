# 🚀 Production Deployment Guide

This guide covers deploying the portfolio backend to production environments.

## 📋 Prerequisites

- Docker and Docker Compose installed
- PostgreSQL database (local or cloud)
- Domain name and SSL certificate (for production)
- Environment variables configured

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   Web Server    │    │   Application   │
│   (Nginx)       │───▶│   (Nginx)       │───▶│   (Node.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Cache Layer   │    │   Database      │
                       │   (Redis)       │    │   (PostgreSQL)  │
                       └─────────────────┘    └─────────────────┘
```

## 🐳 Docker Deployment

### Quick Start

```bash
# Clone repository
git clone <repository-url>
cd backend

# Copy environment file
cp .env.example .env
# Edit .env with your production values

# Build and run with Docker Compose
docker-compose up -d

# Check status
docker-compose ps
```

### Production Deployment

```bash
# Make deployment script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh

# Or manually:
docker build -t portfolio-backend .
docker run -d \
  --name portfolio-backend \
  -p 3000:3000 \
  --env-file .env \
  portfolio-backend
```

## ☁️ Cloud Deployment

### AWS EC2

1. **Launch EC2 Instance**
   ```bash
   # Connect to instance
   ssh -i your-key.pem ubuntu@your-instance-ip
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker ubuntu
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone <repository-url>
   cd backend
   
   # Configure environment
   cp .env.example .env
   nano .env
   
   # Deploy
   ./deploy.sh
   ```

3. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Google Cloud Platform

1. **Create Container Registry**
   ```bash
   # Build and push image
   docker build -t gcr.io/your-project/portfolio-backend .
   docker push gcr.io/your-project/portfolio-backend
   ```

2. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy portfolio-backend \
     --image gcr.io/your-project/portfolio-backend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

### Heroku

1. **Create Heroku App**
   ```bash
   heroku create your-portfolio-backend
   ```

2. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

## 🔧 Environment Configuration

### Production Environment Variables

```env
# Required
NODE_ENV=production
PORT=3000
DB_HOST=your-db-host
DB_PASSWORD=your-secure-password
JWT_SECRET=your-super-secure-jwt-secret
ADMIN_LOGIN_USERNAME=admin@yourdomain.com
ADMIN_LOGIN_PASSWORD=your-secure-password

# Email (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
COMPANY_EMAIL=your-email@gmail.com
COMPANY_EMAIL_PASSWORD=your-app-password

# Security
CORS_ORIGIN=https://yourdomain.com
SESSION_COOKIE_SECURE=true
RATE_LIMIT_MAX_REQUESTS=100
```

### SSL Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📊 Monitoring & Logging

### Health Checks

```bash
# Check application health
curl http://your-domain.com/api/health

# Expected response:
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "version": "1.0.0"
}
```

### Log Monitoring

```bash
# View application logs
docker logs portfolio-backend

# Follow logs in real-time
docker logs -f portfolio-backend

# View specific log levels
docker logs portfolio-backend | grep ERROR
```

### Performance Monitoring

```bash
# Check resource usage
docker stats portfolio-backend

# Monitor database connections
docker exec portfolio-backend npm run db:status
```

## 🔒 Security Checklist

- [ ] **Environment Variables**: All secrets in environment variables
- [ ] **HTTPS**: SSL certificate configured
- [ ] **CORS**: Proper CORS configuration
- [ ] **Rate Limiting**: Rate limiting enabled
- [ ] **Input Validation**: All inputs validated
- [ ] **SQL Injection**: Using parameterized queries
- [ ] **JWT Security**: Secure JWT configuration
- [ ] **File Uploads**: File upload restrictions
- [ ] **Logging**: Sensitive data not logged
- [ ] **Dependencies**: Regular security updates

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check database status
   docker exec portfolio-db pg_isready -U postgres
   
   # Check connection string
   echo $DATABASE_URL
   ```

2. **Port Already in Use**
   ```bash
   # Find process using port
   lsof -i :3000
   
   # Kill process
   kill -9 <PID>
   ```

3. **Memory Issues**
   ```bash
   # Check memory usage
   docker stats
   
   # Increase memory limit
   docker run --memory=2g portfolio-backend
   ```

4. **Email Not Sending**
   ```bash
   # Test email configuration
   docker exec portfolio-backend npm run test:email
   
   # Check SMTP settings
   echo $EMAIL_HOST $EMAIL_PORT
   ```

### Performance Optimization

1. **Enable Caching**
   ```bash
   # Start Redis
   docker run -d --name redis redis:alpine
   
   # Configure application to use Redis
   REDIS_HOST=localhost REDIS_PORT=6379
   ```

2. **Database Optimization**
   ```sql
   -- Add indexes for frequently queried columns
   CREATE INDEX idx_testimonials_approved ON testimonials(approved);
   CREATE INDEX idx_contacts_created_at ON contacts(created_at);
   ```

3. **Load Balancing**
   ```nginx
   upstream backend {
       server 127.0.0.1:3000;
       server 127.0.0.1:3001;
       server 127.0.0.1:3002;
   }
   ```

## 📈 Scaling

### Horizontal Scaling

```bash
# Scale application instances
docker-compose up -d --scale backend=3

# Use load balancer
docker run -d --name nginx \
  -p 80:80 \
  -v /path/to/nginx.conf:/etc/nginx/nginx.conf \
  nginx
```

### Database Scaling

```bash
# Read replicas
# Configure multiple database instances
# Use connection pooling
```

## 🔄 Backup & Recovery

### Database Backup

```bash
# Create backup
docker exec portfolio-db pg_dump -U postgres ashish_portfolio > backup.sql

# Restore backup
docker exec -i portfolio-db psql -U postgres ashish_portfolio < backup.sql
```

### Automated Backups

```bash
# Add to crontab
0 2 * * * docker exec portfolio-db pg_dump -U postgres ashish_portfolio > /backups/backup_$(date +\%Y\%m\%d).sql
```

## 📞 Support

For deployment issues:

1. Check logs: `docker logs portfolio-backend`
2. Verify environment variables
3. Test database connection
4. Check network connectivity
5. Review security configuration

Contact: support@yourdomain.com 