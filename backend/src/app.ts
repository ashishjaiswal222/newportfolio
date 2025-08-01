import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { AppDataSource } from './config/ormconfig';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import blogRoutes from './routes/blog.routes';
import projectRoutes from './routes/project.routes';
import contactRoutes from './routes/contact.routes';
import testimonialRoutes from './routes/testimonial.routes';
import analyticsRoutes from './routes/analytics.routes';
import sitemapRoutes from './routes/sitemap.routes';
import commentRoutes from './routes/comment.routes';

const app = express();

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
  });

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// CORS configuration with proper cookie handling
app.use(cors({
  origin: [
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:3000',
    'http://localhost:4173',
    'http://localhost:5173',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:8081',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:4173',
    'http://127.0.0.1:5173'
  ],
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Set-Cookie']
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: AppDataSource.isInitialized ? 'Connected' : 'Disconnected'
  });
});

// API routes
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/sitemap', sitemapRoutes);
app.use('/api/blogs', commentRoutes); // Mount comment routes under /api/blogs

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;
