import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './config/ormconfig';
import contactRoutes from './routes/contact.routes';
import testimonialRoutes from './routes/testimonial.routes';
import projectRoutes from './routes/project.routes';
import blogRoutes from './routes/blog.routes';
import authRoutes from './routes/auth.routes';
import analyticsRoutes from './routes/analytics.routes';
import { requireAuth } from './middleware/auth.middleware';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:8082',
    'http://localhost:8083',
    'http://localhost:8084',
    'http://localhost:3000',
    process.env.CORS_ORIGIN || 'http://localhost:5173'
  ].filter(Boolean) as string[],
  credentials: true
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Public routes (no authentication required)
app.use('/api/contacts', contactRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);

// Auth routes
app.use('/api/auth', authRoutes);

// Protected admin routes (require authentication)
app.use('/api/admin/contacts', requireAuth, contactRoutes);
app.use('/api/admin/testimonials', requireAuth, testimonialRoutes);
app.use('/api/admin/projects', requireAuth, projectRoutes);
app.use('/api/admin/blogs', requireAuth, blogRoutes);
app.use('/api/admin/analytics', requireAuth, analyticsRoutes);

// Database initialization is now handled in server.ts

export default app;
