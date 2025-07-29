import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './config/ormconfig';
import projectRoutes from './routes/project.routes';
import testimonialRoutes from './routes/testimonial.routes';
import contactRoutes from './routes/contact.routes';
import authRoutes from './routes/auth.routes';
import blogRoutes from './routes/blog.routes';
import analyticsRoutes from './routes/analytics.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: AppDataSource.isInitialized ? 'Connected' : 'Disconnected'
  });
});

// API routes
app.use('/api/projects', projectRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

async function startServer() {
  try {
    console.log('🔄 Initializing database connection...');
    
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('✅ Database connection established');
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log('📋 Available endpoints:');
      console.log('   GET  /health');
      console.log('   GET  /api/projects');
      console.log('   GET  /api/testimonials');
      console.log('   POST /api/contacts');
      console.log('   POST /api/auth/login');
      console.log('   GET  /api/analytics');
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log('✅ Database connection closed');
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log('✅ Database connection closed');
  }
  process.exit(0);
});

startServer();
